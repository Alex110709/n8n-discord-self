import {
  INodeType,
  INodeTypeDescription,
  ITriggerFunctions,
  ITriggerResponse,
  IDataObject,
  NodeOperationError,
} from 'n8n-workflow';

import { 
  Client, 
  Message, 
  GuildMember, 
  MessageReaction, 
  User,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  PartialGuildMember
} from 'discord.js-selfbot-v13';

export class DiscordSelfTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Discord User Trigger',
    name: 'discordUserTrigger',
    icon: 'file:discord.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Trigger workflow on Discord events (messages, reactions, members)',
    defaults: {
      name: 'Discord User Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'discordSelfApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Message Created',
            value: 'messageCreate',
            description: 'Triggers when a new message is sent (servers + DMs)',
          },
          {
            name: 'DM Received',
            value: 'dmReceived',
            description: 'Triggers when you receive a direct message',
          },
          {
            name: 'Message Updated',
            value: 'messageUpdate',
            description: 'Triggers when a message is edited',
          },
          {
            name: 'Message Deleted',
            value: 'messageDelete',
            description: 'Triggers when a message is deleted',
          },
          {
            name: 'Reaction Added',
            value: 'messageReactionAdd',
            description: 'Triggers when a reaction is added to a message',
          },
          {
            name: 'Reaction Removed',
            value: 'messageReactionRemove',
            description: 'Triggers when a reaction is removed from a message',
          },
          {
            name: 'Member Joined',
            value: 'guildMemberAdd',
            description: 'Triggers when a member joins a server',
          },
          {
            name: 'Member Left',
            value: 'guildMemberRemove',
            description: 'Triggers when a member leaves a server',
          },
          {
            name: 'Member Updated',
            value: 'guildMemberUpdate',
            description: 'Triggers when a member is updated (role, nickname)',
          },
          {
            name: 'Presence Updated',
            value: 'presenceUpdate',
            description: 'Triggers when a user presence changes',
          },
          {
            name: 'Typing Started',
            value: 'typingStart',
            description: 'Triggers when a user starts typing',
          },
        ],
        default: 'messageCreate',
        required: true,
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        options: [
          {
            displayName: 'Channel IDs',
            name: 'channelIds',
            type: 'string',
            default: '',
            description: 'Comma-separated list of channel IDs to monitor (leave empty for all)',
            placeholder: '123456789,987654321',
          },
          {
            displayName: 'Server IDs',
            name: 'serverIds',
            type: 'string',
            default: '',
            description: 'Comma-separated list of server IDs to monitor (leave empty for all)',
            placeholder: '123456789,987654321',
          },
          {
            displayName: 'User IDs',
            name: 'userIds',
            type: 'string',
            default: '',
            description: 'Comma-separated list of user IDs to monitor (leave empty for all)',
            placeholder: '123456789,987654321',
          },
          {
            displayName: 'Contains Text',
            name: 'containsText',
            type: 'string',
            default: '',
            displayOptions: {
              show: {
                '/event': ['messageCreate', 'messageUpdate'],
              },
            },
            description: 'Only trigger if message contains this text',
          },
          {
            displayName: 'Starts With',
            name: 'startsWith',
            type: 'string',
            default: '',
            displayOptions: {
              show: {
                '/event': ['messageCreate', 'messageUpdate'],
              },
            },
            description: 'Only trigger if message starts with this text (e.g., "!" for commands)',
          },
          {
            displayName: 'Ignore Bots',
            name: 'ignoreBots',
            type: 'boolean',
            default: true,
            description: 'Whether to ignore messages from bots',
          },
          {
            displayName: 'Ignore Self',
            name: 'ignoreSelf',
            type: 'boolean',
            default: false,
            description: 'Whether to ignore messages from yourself',
          },
          {
            displayName: 'DM Only',
            name: 'dmOnly',
            type: 'boolean',
            default: false,
            description: 'Whether to only trigger on direct messages',
          },
          {
            displayName: 'Server Only',
            name: 'serverOnly',
            type: 'boolean',
            default: false,
            description: 'Whether to only trigger on server messages (ignore DMs)',
          },
        ],
      },
    ],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const credentials = await this.getCredentials('discordSelfApi');
    const token = credentials.token as string;
    const event = this.getNodeParameter('event') as string;
    const filters = this.getNodeParameter('filters', {}) as IDataObject;

    // Validate token
    if (!token || token.trim() === '') {
      throw new NodeOperationError(
        this.getNode(),
        'Discord token is required. Please check your credentials.',
      );
    }

    let client: Client;
    
    try {
      console.log('[Discord Trigger] 🔨 Creating Discord Client...');
      
      // Create client with minimal configuration
      client = new Client({
        checkUpdate: false,
      });
      
      console.log('[Discord Trigger] ✅ Client created successfully');
    } catch (error) {
      console.error('[Discord Trigger] ❌ Failed to create Client:', error);
      throw new NodeOperationError(
        this.getNode(),
        `Failed to create Discord Client: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const closeFunction = async () => {
      await client.destroy();
    };

    try {
      console.log('[Discord Trigger] 🔐 Logging in...');
      await client.login(token);
      console.log('[Discord Trigger] ✅ Login successful');

      // Simple delay to let client initialize - discord.js-selfbot-v13 doesn't need ready event
      console.log('[Discord Trigger] ⏳ Waiting for client initialization...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('[Discord Trigger] ✅ Client initialized');
      
      console.log(`[Discord Trigger] 📊 Watching for event: ${event}`);
      console.log(`[Discord Trigger] 🔧 Filters:`, JSON.stringify(filters, null, 2));

      console.log('[Discord Trigger] 🔧 Setting up event listeners...');
      
      try {
        // All event setup wrapped in try-catch to catch any internal errors

      // Helper function to check filters
      const passesFilters = (data: any): boolean => {
        // DM only filter
        if (filters.dmOnly && !data.isDM) {
          return false;
        }
        
        // Server only filter
        if (filters.serverOnly && data.isDM) {
          return false;
        }

        // Channel filter
        if (filters.channelIds) {
          const channelIds = (filters.channelIds as string).split(',').map((id) => id.trim());
          if (data.channelId && !channelIds.includes(data.channelId)) {
            return false;
          }
        }

        // Server filter
        if (filters.serverIds) {
          const serverIds = (filters.serverIds as string).split(',').map((id) => id.trim());
          if (data.guildId && !serverIds.includes(data.guildId)) {
            return false;
          }
        }

        // User filter
        if (filters.userIds) {
          const userIds = (filters.userIds as string).split(',').map((id) => id.trim());
          if (data.userId && !userIds.includes(data.userId)) {
            return false;
          }
        }

        // Ignore bots
        if (filters.ignoreBots && data.isBot) {
          return false;
        }

        // Ignore self
        if (filters.ignoreSelf && data.userId === client.user?.id) {
          return false;
        }

        // Text contains filter
        if (filters.containsText && data.content) {
          if (!data.content.toLowerCase().includes((filters.containsText as string).toLowerCase())) {
            return false;
          }
        }

        // Starts with filter
        if (filters.startsWith && data.content) {
          if (!data.content.startsWith(filters.startsWith as string)) {
            return false;
          }
        }

        return true;
      };

      // Message Created or DM Received
      if (event === 'messageCreate' || event === 'dmReceived') {
        try {
          console.log(`[Discord Trigger] 🎯 Setting up messageCreate listener for event: ${event}`);
          
          client.on('messageCreate', async (message: Message) => {
          try {
            // Check if it's a DM - handle both numeric and string channel types
            const channelType = (message.channel as any).type;
            const isDM = channelType === 1 || channelType === 'DM';
            
            // Detailed debug log
            console.log(`[Discord Trigger] 📨 MESSAGE RECEIVED:`, {
              event: event,
              author: message.author.username,
              authorId: message.author.id,
              channelId: message.channelId,
              channelType: channelType,
              isDM: isDM,
              content: message.content.substring(0, 100),
              timestamp: new Date().toISOString(),
            });
            
            // For dmReceived event, only trigger on DMs from others
            if (event === 'dmReceived') {
              console.log(`[Discord Trigger] 🔍 Checking dmReceived conditions - isDM: ${isDM}, isSelf: ${message.author.id === client.user?.id}`);
              if (!isDM || message.author.id === client.user?.id) {
                console.log(`[Discord Trigger] ⏭️ Skipping - not a DM from others`);
                return;
              }
            }

            const data = {
              messageId: message.id,
              channelId: message.channelId,
              guildId: message.guildId,
              content: message.content,
              userId: message.author.id,
              isBot: message.author.bot,
              isDM,
              channelType: String(message.channel.type),
              author: {
                id: message.author.id,
                username: message.author.username,
                discriminator: message.author.discriminator,
                avatar: message.author.avatar,
              },
              mentions: message.mentions.users.map((u) => ({
                id: u.id,
                username: u.username,
              })),
              attachments: message.attachments.map((a) => ({
                id: a.id,
                url: a.url,
                name: a.name,
                size: a.size,
              })),
              embeds: message.embeds,
              createdAt: message.createdAt,
              timestamp: message.createdTimestamp,
            };

            if (passesFilters(data)) {
              console.log(`[Discord Trigger] ✅ EMITTING message data:`, {
                author: message.author.username,
                isDM: isDM,
                messageId: message.id,
              });
              this.emit([this.helpers.returnJsonArray([data])]);
            } else {
              console.log(`[Discord Trigger] ❌ Message FILTERED OUT:`, {
                author: message.author.username,
                isDM: isDM,
                filters: {
                  dmOnly: filters.dmOnly,
                  serverOnly: filters.serverOnly,
                  ignoreSelf: filters.ignoreSelf,
                },
              });
            }
          } catch (error) {
            console.error(`[Discord Trigger] ❌ Error processing message:`, error);
          }
        });
        console.log(`[Discord Trigger] ✅ messageCreate listener set up successfully`);
      } catch (error) {
        console.error(`[Discord Trigger] ❌ Error setting up messageCreate listener:`, error);
        throw error;
      }
    }

      // Message Updated
      else if (event === 'messageUpdate') {
        client.on('messageUpdate', async (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
          if (!newMessage.author) return;
          
          const data = {
            messageId: newMessage.id,
            channelId: newMessage.channelId,
            guildId: newMessage.guildId,
            oldContent: oldMessage.content,
            newContent: newMessage.content,
            userId: newMessage.author.id,
            isBot: newMessage.author.bot,
            author: {
              id: newMessage.author.id,
              username: newMessage.author.username,
            },
            editedAt: newMessage.editedAt,
          };

          if (passesFilters({ ...data, content: data.newContent })) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Message Deleted
      else if (event === 'messageDelete') {
        client.on('messageDelete', async (message: Message | PartialMessage) => {
          const data = {
            messageId: message.id,
            channelId: message.channelId,
            guildId: message.guildId,
            content: message.content,
            userId: message.author?.id,
            isBot: message.author?.bot,
            deletedAt: new Date().toISOString(),
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Reaction Added
      else if (event === 'messageReactionAdd') {
        client.on('messageReactionAdd', async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
          const data = {
            messageId: reaction.message.id,
            channelId: reaction.message.channelId,
            guildId: reaction.message.guildId,
            emoji: reaction.emoji.name,
            emojiId: reaction.emoji.id,
            userId: user.id,
            isBot: user.bot,
            user: {
              id: user.id,
              username: user.username,
            },
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Reaction Removed
      else if (event === 'messageReactionRemove') {
        client.on('messageReactionRemove', async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
          const data = {
            messageId: reaction.message.id,
            channelId: reaction.message.channelId,
            guildId: reaction.message.guildId,
            emoji: reaction.emoji.name,
            emojiId: reaction.emoji.id,
            userId: user.id,
            isBot: user.bot,
            user: {
              id: user.id,
              username: user.username,
            },
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Member Joined
      else if (event === 'guildMemberAdd') {
        client.on('guildMemberAdd', async (member: GuildMember) => {
          const data = {
            userId: member.id,
            guildId: member.guild.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            isBot: member.user.bot,
            joinedAt: member.joinedAt,
            roles: member.roles.cache.map((r) => ({
              id: r.id,
              name: r.name,
            })),
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Member Left
      else if (event === 'guildMemberRemove') {
        client.on('guildMemberRemove', async (member: GuildMember | PartialGuildMember) => {
          const data = {
            userId: member.id,
            guildId: member.guild.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            isBot: member.user.bot,
            leftAt: new Date().toISOString(),
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Member Updated
      else if (event === 'guildMemberUpdate') {
        client.on('guildMemberUpdate', async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
          const data = {
            userId: newMember.id,
            guildId: newMember.guild.id,
            username: newMember.user.username,
            oldNickname: oldMember.nickname,
            newNickname: newMember.nickname,
            oldRoles: oldMember.roles.cache.map((r) => ({ id: r.id, name: r.name })),
            newRoles: newMember.roles.cache.map((r) => ({ id: r.id, name: r.name })),
            isBot: newMember.user.bot,
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Presence Updated
      else if (event === 'presenceUpdate') {
        client.on('presenceUpdate', async (oldPresence: any, newPresence: any) => {
          if (!newPresence || !newPresence.user) return;

          const data = {
            userId: newPresence.userId,
            guildId: newPresence.guild?.id,
            username: newPresence.user.username,
            oldStatus: oldPresence?.status,
            newStatus: newPresence.status,
            activities: newPresence.activities?.map((a: any) => ({
              name: a.name,
              type: a.type,
              details: a.details,
            })),
            isBot: newPresence.user.bot,
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }

      // Typing Started
      else if (event === 'typingStart') {
        client.on('typingStart', async (typing: any) => {
          const data = {
            channelId: typing.channel.id,
            guildId: typing.guild?.id,
            userId: typing.user.id,
            username: typing.user.username,
            isBot: typing.user.bot,
            startedAt: new Date(typing.startedTimestamp).toISOString(),
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }
      // Error handling for client
      client.on('error', (error) => {
        console.error('Discord Client Error:', error);
      });
      
      console.log('[Discord Trigger] ✅ All event listeners set up successfully');
      
      } catch (setupError) {
        console.error('[Discord Trigger] ❌ Error during event listener setup:', setupError);
        throw setupError;
      }

    } catch (error) {
      await client.destroy();
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Provide helpful error messages
      if (errorMessage.includes('TOKEN_INVALID') || errorMessage.includes('Incorrect login')) {
        throw new NodeOperationError(
          this.getNode(),
          'Invalid Discord token. Please check your credentials and make sure the token is correct.',
        );
      }
      
      throw new NodeOperationError(
        this.getNode(),
        `Discord Trigger error: ${errorMessage}`,
      );
    }

    return {
      closeFunction,
    };
  }
}
