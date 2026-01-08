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
  PartialGuildMember,
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

    if (!token || token.trim() === '') {
      throw new NodeOperationError(
        this.getNode(),
        'Discord token is required. Please check your credentials.',
      );
    }

    let client: Client;

    try {
      client = new Client({
        checkUpdate: false,
        intents: 32767,
      });
    } catch (error) {
      throw new NodeOperationError(
        this.getNode(),
        `Failed to create Discord Client: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const closeFunction = async () => {
      if (client) {
        client.removeAllListeners();
        await client.destroy();
      }
    };

    const isDMChannel = (channelType: number | string): boolean => {
      // DM = 1, Group DM = 3 in discord.js v13
      const typeNum = typeof channelType === 'string' ? parseInt(channelType, 10) : channelType;
      return typeNum === 1 || typeNum === 3;
    };

    const parseIds = (ids: string | undefined): string[] => {
      if (!ids || ids.trim() === '') return [];
      return ids
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id !== '');
    };

    const passesFilters = (data: {
      channelId?: string;
      guildId?: string | null;
      userId?: string;
      isBot?: boolean;
      isDM?: boolean;
      content?: string | null;
    }): boolean => {
      if (filters.dmOnly && !data.isDM) return false;
      if (filters.serverOnly && data.isDM) return false;

      const channelIds = parseIds(filters.channelIds as string);
      if (channelIds.length > 0 && data.channelId && !channelIds.includes(data.channelId)) {
        return false;
      }

      const serverIds = parseIds(filters.serverIds as string);
      if (serverIds.length > 0 && data.guildId && !serverIds.includes(data.guildId)) {
        return false;
      }

      const userIds = parseIds(filters.userIds as string);
      if (userIds.length > 0 && data.userId && !userIds.includes(data.userId)) {
        return false;
      }

      if (filters.ignoreBots && data.isBot) return false;
      if (filters.ignoreSelf && data.userId === client.user?.id) return false;

      if (filters.containsText && typeof filters.containsText === 'string' && data.content) {
        if (!data.content.toLowerCase().includes(filters.containsText.toLowerCase())) {
          return false;
        }
      }

      if (filters.startsWith && typeof filters.startsWith === 'string' && data.content) {
        if (!data.content.startsWith(filters.startsWith)) {
          return false;
        }
      }

      return true;
    };

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Discord client ready timeout (30s)'));
        }, 30000);

        client.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        client.login(token).catch((err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      client.on('error', (error) => {
        console.error('[Discord Trigger] Client error:', error.message);
      });

      if (event === 'messageCreate' || event === 'dmReceived') {
        client.on('messageCreate', (message: Message) => {
          try {
            // More lenient DM detection
            const channelType = message.channel.type;
            // DM channels have no guild (guildId is null)
            const hasNoGuild =
              !message.guildId || message.guildId === null || message.guildId === undefined;
            // Parse channel type to number for comparison
            const typeNum =
              typeof channelType === 'number' ? channelType : parseInt(String(channelType), 10);
            // DM = 1, Group DM = 3
            const isDMChannelType = typeNum === 1 || typeNum === 3;
            // DM is true if either channel type indicates DM OR no guild
            const isDM = isDMChannelType || hasNoGuild;

            // For dmReceived: only trigger on DMs from OTHER users (not self)
            if (event === 'dmReceived') {
              const clientId = client.user?.id ?? '';
              const isFromSelf = message.author.id === clientId;
              if (isFromSelf) {
                return; // Ignore own messages
              }
              if (!isDM) {
                return; // Only trigger on DMs
              }
            }

            // Build message data
            const data = {
              messageId: message.id,
              channelId: message.channelId,
              guildId: message.guildId,
              content: message.content,
              userId: message.author.id,
              isBot: message.author.bot,
              isDM,
              channelType: String(channelType),
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
              embeds: message.embeds.map((e) => ({
                title: e.title,
                description: e.description,
                url: e.url,
              })),
              createdAt: message.createdAt,
              timestamp: message.createdTimestamp,
            };

            if (passesFilters(data)) {
              this.emit([this.helpers.returnJsonArray([data])]);
            }
          } catch (error) {
            console.error('[Discord Trigger] Error processing message:', error);
          }
        });
      } else if (event === 'messageUpdate') {
        client.on(
          'messageUpdate',
          (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
            if (!newMessage.author) return;

            const isDM = isDMChannel(newMessage.channel.type);
            const data = {
              messageId: newMessage.id,
              channelId: newMessage.channelId,
              guildId: newMessage.guildId,
              oldContent: oldMessage.content,
              newContent: newMessage.content,
              content: newMessage.content,
              userId: newMessage.author.id,
              isBot: newMessage.author.bot,
              isDM,
              author: {
                id: newMessage.author.id,
                username: newMessage.author.username,
              },
              editedAt: newMessage.editedAt,
            };

            if (passesFilters(data)) {
              this.emit([this.helpers.returnJsonArray([data])]);
            }
          },
        );
      } else if (event === 'messageDelete') {
        client.on('messageDelete', (message: Message | PartialMessage) => {
          const isDM = isDMChannel(message.channel.type);
          const data = {
            messageId: message.id,
            channelId: message.channelId,
            guildId: message.guildId,
            content: message.content,
            userId: message.author?.id,
            isBot: message.author?.bot,
            isDM,
            deletedAt: new Date().toISOString(),
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      } else if (event === 'messageReactionAdd') {
        client.on(
          'messageReactionAdd',
          (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
            const isDM = isDMChannel(reaction.message.channel.type);
            const data = {
              messageId: reaction.message.id,
              channelId: reaction.message.channelId,
              guildId: reaction.message.guildId,
              emoji: reaction.emoji.name,
              emojiId: reaction.emoji.id,
              userId: user.id,
              isBot: user.bot ?? false,
              isDM,
              user: {
                id: user.id,
                username: user.username,
              },
            };

            if (passesFilters(data)) {
              this.emit([this.helpers.returnJsonArray([data])]);
            }
          },
        );
      } else if (event === 'messageReactionRemove') {
        client.on(
          'messageReactionRemove',
          (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
            const isDM = isDMChannel(reaction.message.channel.type);
            const data = {
              messageId: reaction.message.id,
              channelId: reaction.message.channelId,
              guildId: reaction.message.guildId,
              emoji: reaction.emoji.name,
              emojiId: reaction.emoji.id,
              userId: user.id,
              isBot: user.bot ?? false,
              isDM,
              user: {
                id: user.id,
                username: user.username,
              },
            };

            if (passesFilters(data)) {
              this.emit([this.helpers.returnJsonArray([data])]);
            }
          },
        );
      } else if (event === 'guildMemberAdd') {
        client.on('guildMemberAdd', (member: GuildMember) => {
          const data = {
            userId: member.id,
            guildId: member.guild.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            isBot: member.user.bot,
            isDM: false,
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
      } else if (event === 'guildMemberRemove') {
        client.on('guildMemberRemove', (member: GuildMember | PartialGuildMember) => {
          const data = {
            userId: member.id,
            guildId: member.guild.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            isBot: member.user.bot,
            isDM: false,
            leftAt: new Date().toISOString(),
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      } else if (event === 'guildMemberUpdate') {
        client.on(
          'guildMemberUpdate',
          (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
            const data = {
              userId: newMember.id,
              guildId: newMember.guild.id,
              username: newMember.user.username,
              oldNickname: oldMember.nickname,
              newNickname: newMember.nickname,
              oldRoles: oldMember.roles.cache.map((r) => ({ id: r.id, name: r.name })),
              newRoles: newMember.roles.cache.map((r) => ({ id: r.id, name: r.name })),
              isBot: newMember.user.bot,
              isDM: false,
            };

            if (passesFilters(data)) {
              this.emit([this.helpers.returnJsonArray([data])]);
            }
          },
        );
      } else if (event === 'presenceUpdate') {
        client.on('presenceUpdate', (oldPresence, newPresence) => {
          if (!newPresence || !newPresence.user) return;

          const data = {
            userId: newPresence.userId,
            guildId: newPresence.guild?.id,
            username: newPresence.user.username,
            oldStatus: oldPresence?.status,
            newStatus: newPresence.status,
            activities: newPresence.activities?.map((a) => ({
              name: a.name,
              type: a.type,
              details: a.details,
            })),
            isBot: newPresence.user.bot,
            isDM: false,
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      } else if (event === 'typingStart') {
        client.on('typingStart', (typing) => {
          const isDM = isDMChannel(typing.channel.type);
          const data = {
            channelId: typing.channel.id,
            guildId: typing.guild?.id,
            userId: typing.user.id,
            username: typing.user.username,
            isBot: typing.user.bot,
            isDM,
            startedAt: new Date(typing.startedTimestamp).toISOString(),
          };

          if (passesFilters(data)) {
            this.emit([this.helpers.returnJsonArray([data])]);
          }
        });
      }
    } catch (error) {
      await closeFunction();
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('TOKEN_INVALID') || errorMessage.includes('Incorrect login')) {
        throw new NodeOperationError(
          this.getNode(),
          'Invalid Discord token. Please check your credentials and make sure the token is correct.',
        );
      }

      throw new NodeOperationError(this.getNode(), `Discord Trigger error: ${errorMessage}`);
    }

    return {
      closeFunction,
    };
  }
}
