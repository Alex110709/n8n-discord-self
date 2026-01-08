import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
} from 'n8n-workflow';

import { Client, TextChannel, DMChannel, NewsChannel } from 'discord.js-selfbot-v13';

type SendableChannel = TextChannel | DMChannel | NewsChannel;

export class DiscordUserTool implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Discord User Tool',
    name: 'discordUserTool',
    icon: 'file:discord.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["action"]}}',
    description:
      'Discord automation tool for AI Agents - Send messages, read channels, manage servers, and interact with Discord',
    defaults: {
      name: 'Discord Tool',
    },
    inputs: ['main'],
    outputs: ['main'],
    usableAsTool: true,
    credentials: [
      {
        name: 'discordSelfApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Action',
        name: 'action',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Send Message to Channel',
            value: 'sendMessage',
            description: 'Send a text message to a Discord channel',
            action: 'Send message to channel',
          },
          {
            name: 'Send Direct Message',
            value: 'sendDM',
            description: 'Send a direct message (DM) to a Discord user',
            action: 'Send direct message to user',
          },
          {
            name: 'Read Messages',
            value: 'readMessages',
            description: 'Read recent messages from a Discord channel',
            action: 'Read messages from channel',
          },
          {
            name: 'Edit Message',
            value: 'editMessage',
            description: 'Edit an existing message that you sent',
            action: 'Edit a message',
          },
          {
            name: 'Delete Message',
            value: 'deleteMessage',
            description: 'Delete a message from a channel',
            action: 'Delete a message',
          },
          {
            name: 'Add Reaction',
            value: 'addReaction',
            description: 'Add an emoji reaction to a message',
            action: 'Add reaction to message',
          },
          {
            name: 'Get Server Info',
            value: 'getServerInfo',
            description: 'Get information about a Discord server (guild)',
            action: 'Get server information',
          },
          {
            name: 'List Servers',
            value: 'listServers',
            description: 'List all Discord servers the user is a member of',
            action: 'List all servers',
          },
          {
            name: 'List Channels',
            value: 'listChannels',
            description: 'List all channels in a Discord server',
            action: 'List channels in server',
          },
          {
            name: 'List Members',
            value: 'listMembers',
            description: 'List members in a Discord server',
            action: 'List server members',
          },
          {
            name: 'Get User Info',
            value: 'getUserInfo',
            description: 'Get information about a Discord user',
            action: 'Get user information',
          },
          {
            name: 'Search Messages',
            value: 'searchMessages',
            description: 'Search for messages containing specific text in a channel',
            action: 'Search messages in channel',
          },
          {
            name: 'Set Status',
            value: 'setStatus',
            description: 'Set your online status (online, idle, dnd, invisible)',
            action: 'Set online status',
          },
          {
            name: 'Join Server',
            value: 'joinServer',
            description: 'Join a Discord server using an invite code',
            action: 'Join server with invite',
          },
          {
            name: 'Leave Server',
            value: 'leaveServer',
            description: 'Leave a Discord server',
            action: 'Leave a server',
          },
        ],
        default: 'sendMessage',
      },
      {
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            action: [
              'sendMessage',
              'readMessages',
              'editMessage',
              'deleteMessage',
              'addReaction',
              'searchMessages',
            ],
          },
        },
        description: 'The Discord channel ID (enable Developer Mode in Discord to copy IDs)',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            action: ['sendDM', 'getUserInfo'],
          },
        },
        description: 'The Discord user ID to send DM to or get info about',
      },
      {
        displayName: 'Message Content',
        name: 'content',
        type: 'string',
        default: '',
        required: true,
        typeOptions: {
          rows: 4,
        },
        displayOptions: {
          show: {
            action: ['sendMessage', 'sendDM'],
          },
        },
        description: 'The text content of the message to send',
      },
      {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            action: ['editMessage', 'deleteMessage', 'addReaction'],
          },
        },
        description: 'The ID of the message to edit, delete, or react to',
      },
      {
        displayName: 'New Content',
        name: 'newContent',
        type: 'string',
        default: '',
        required: true,
        typeOptions: {
          rows: 4,
        },
        displayOptions: {
          show: {
            action: ['editMessage'],
          },
        },
        description: 'The new text content for the message',
      },
      {
        displayName: 'Emoji',
        name: 'emoji',
        type: 'string',
        default: '👍',
        required: true,
        displayOptions: {
          show: {
            action: ['addReaction'],
          },
        },
        description: 'The emoji to add as reaction (e.g., 👍, ❤️, 🎉)',
      },
      {
        displayName: 'Server ID',
        name: 'serverId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            action: ['getServerInfo', 'listChannels', 'listMembers', 'leaveServer'],
          },
        },
        description: 'The Discord server (guild) ID',
      },
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            action: ['searchMessages'],
          },
        },
        description: 'The text to search for in messages',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 10,
        displayOptions: {
          show: {
            action: ['readMessages', 'listMembers', 'searchMessages'],
          },
        },
        description: 'Maximum number of items to return',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: 'online',
        required: true,
        displayOptions: {
          show: {
            action: ['setStatus'],
          },
        },
        options: [
          { name: 'Online', value: 'online' },
          { name: 'Idle', value: 'idle' },
          { name: 'Do Not Disturb', value: 'dnd' },
          { name: 'Invisible', value: 'invisible' },
        ],
        description: 'Your online status',
      },
      {
        displayName: 'Invite Code',
        name: 'inviteCode',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            action: ['joinServer'],
          },
        },
        description: 'The Discord invite code (e.g., "abc123" from discord.gg/abc123)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('discordSelfApi');
    const token = credentials.token as string;

    const client = new Client({ checkUpdate: false });

    try {
      await client.login(token);

      for (let i = 0; i < items.length; i++) {
        try {
          const action = this.getNodeParameter('action', i) as string;
          let result: IDataObject | IDataObject[];

          switch (action) {
            case 'sendMessage': {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const content = this.getNodeParameter('content', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('send' in channel)) {
                throw new NodeOperationError(
                  this.getNode(),
                  `Channel ${channelId} not found or cannot send messages`,
                );
              }
              const message = await (channel as SendableChannel).send(content);
              result = {
                success: true,
                messageId: message.id,
                channelId: message.channelId,
                content: message.content,
                timestamp: message.createdAt.toISOString(),
              };
              break;
            }

            case 'sendDM': {
              const userId = this.getNodeParameter('userId', i) as string;
              const content = this.getNodeParameter('content', i) as string;
              const user = await client.users.fetch(userId);
              if (!user) {
                throw new NodeOperationError(this.getNode(), `User ${userId} not found`);
              }
              const dmChannel = await user.createDM();
              const message = await dmChannel.send(content);
              result = {
                success: true,
                messageId: message.id,
                recipientId: userId,
                recipientUsername: user.username,
                content: message.content,
                timestamp: message.createdAt.toISOString(),
              };
              break;
            }

            case 'readMessages': {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const limit = this.getNodeParameter('limit', i, 10) as number;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(
                  this.getNode(),
                  `Channel ${channelId} not found or has no messages`,
                );
              }
              const messages = await (channel as SendableChannel).messages.fetch({ limit });
              result = Array.from(messages.values()).map((m) => ({
                messageId: m.id,
                content: m.content,
                authorId: m.author.id,
                authorUsername: m.author.username,
                timestamp: m.createdAt.toISOString(),
                hasAttachments: m.attachments.size > 0,
              }));
              break;
            }

            case 'editMessage': {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const newContent = this.getNodeParameter('newContent', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), `Channel ${channelId} not found`);
              }
              const message = await (channel as SendableChannel).messages.fetch(messageId);
              const edited = await message.edit(newContent);
              result = {
                success: true,
                messageId: edited.id,
                newContent: edited.content,
                editedAt: edited.editedAt?.toISOString(),
              };
              break;
            }

            case 'deleteMessage': {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), `Channel ${channelId} not found`);
              }
              const message = await (channel as SendableChannel).messages.fetch(messageId);
              await message.delete();
              result = {
                success: true,
                deletedMessageId: messageId,
              };
              break;
            }

            case 'addReaction': {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const emoji = this.getNodeParameter('emoji', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), `Channel ${channelId} not found`);
              }
              const message = await (channel as SendableChannel).messages.fetch(messageId);
              await message.react(emoji);
              result = {
                success: true,
                messageId,
                emoji,
              };
              break;
            }

            case 'getServerInfo': {
              const serverId = this.getNodeParameter('serverId', i) as string;
              const guild = await client.guilds.fetch(serverId);
              result = {
                serverId: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                ownerId: guild.ownerId,
                createdAt: guild.createdAt.toISOString(),
                description: guild.description,
                icon: guild.iconURL(),
              };
              break;
            }

            case 'listServers': {
              const guilds = await client.guilds.fetch();
              result = Array.from(guilds.values()).map((g) => ({
                serverId: g.id,
                name: g.name,
              }));
              break;
            }

            case 'listChannels': {
              const serverId = this.getNodeParameter('serverId', i) as string;
              const guild = await client.guilds.fetch(serverId);
              const channels = await guild.channels.fetch();
              result = Array.from(channels.values())
                .filter((c) => c !== null)
                .map((c) => ({
                  channelId: c!.id,
                  name: c!.name,
                  type: c!.type,
                  position: c!.position,
                }));
              break;
            }

            case 'listMembers': {
              const serverId = this.getNodeParameter('serverId', i) as string;
              const limit = this.getNodeParameter('limit', i, 100) as number;
              const guild = await client.guilds.fetch(serverId);
              const members = await guild.members.fetch({ limit });
              result = Array.from(members.values()).map((m) => ({
                oderId: m.id,
                odername: m.user.username,
                nickname: m.nickname,
                joinedAt: m.joinedAt?.toISOString(),
                isBot: m.user.bot,
              }));
              break;
            }

            case 'getUserInfo': {
              const userId = this.getNodeParameter('userId', i) as string;
              const user = await client.users.fetch(userId);
              result = {
                userId: user.id,
                username: user.username,
                discriminator: user.discriminator,
                avatar: user.avatarURL(),
                isBot: user.bot,
                createdAt: user.createdAt.toISOString(),
              };
              break;
            }

            case 'searchMessages': {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const searchQuery = this.getNodeParameter('searchQuery', i) as string;
              const limit = this.getNodeParameter('limit', i, 50) as number;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), `Channel ${channelId} not found`);
              }
              const messages = await (channel as SendableChannel).messages.fetch({ limit: 100 });
              const filtered = Array.from(messages.values())
                .filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, limit);
              result = filtered.map((m) => ({
                messageId: m.id,
                content: m.content,
                authorId: m.author.id,
                authorUsername: m.author.username,
                timestamp: m.createdAt.toISOString(),
              }));
              break;
            }

            case 'setStatus': {
              const status = this.getNodeParameter('status', i) as
                | 'online'
                | 'idle'
                | 'dnd'
                | 'invisible';
              await client.user?.setStatus(status);
              result = {
                success: true,
                newStatus: status,
              };
              break;
            }

            case 'joinServer': {
              const inviteCode = this.getNodeParameter('inviteCode', i) as string;
              const invite = await client.fetchInvite(inviteCode);
              await invite.acceptInvite();
              result = {
                success: true,
                joinedServer: invite.guild?.name,
                serverId: invite.guild?.id,
              };
              break;
            }

            case 'leaveServer': {
              const serverId = this.getNodeParameter('serverId', i) as string;
              const guild = await client.guilds.fetch(serverId);
              await guild.leave();
              result = {
                success: true,
                leftServerId: serverId,
              };
              break;
            }

            default:
              throw new NodeOperationError(this.getNode(), `Unknown action: ${action}`);
          }

          if (Array.isArray(result)) {
            result.forEach((item) => returnData.push({ json: item, pairedItem: { item: i } }));
          } else {
            returnData.push({ json: result, pairedItem: { item: i } });
          }
        } catch (error) {
          if (this.continueOnFail()) {
            returnData.push({
              json: { error: error instanceof Error ? error.message : String(error) },
              pairedItem: { item: i },
            });
            continue;
          }
          throw error;
        }
      }

      await client.destroy();
    } catch (error) {
      await client.destroy();
      throw new NodeOperationError(
        this.getNode(),
        `Discord error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return [returnData];
  }
}
