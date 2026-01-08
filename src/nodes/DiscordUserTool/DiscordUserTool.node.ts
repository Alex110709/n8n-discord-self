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
    subtitle: '={{$parameter["operation"]}}',
    description:
      'Discord operations for AI Agents. Send/read messages, manage servers, and interact with Discord. Use this when you need to communicate on Discord or get Discord information.',
    defaults: {
      name: 'Discord User Tool',
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
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Send Message',
            value: 'sendMessage',
            description:
              'Send a text message to a channel. Input: channelId (required), content (required)',
          },
          {
            name: 'Send Direct Message',
            value: 'sendDM',
            description: 'Send a DM to a user. Input: userId (required), content (required)',
          },
          {
            name: 'Read Messages',
            value: 'readMessages',
            description:
              'Get recent messages from a channel. Input: channelId (required), limit (optional, default 10)',
          },
          {
            name: 'Edit Message',
            value: 'editMessage',
            description:
              'Edit a message you sent. Input: channelId (required), messageId (required), newContent (required)',
          },
          {
            name: 'Delete Message',
            value: 'deleteMessage',
            description: 'Delete a message. Input: channelId (required), messageId (required)',
          },
          {
            name: 'Add Reaction',
            value: 'addReaction',
            description:
              'Add an emoji reaction. Input: channelId (required), messageId (required), emoji (required)',
          },
          {
            name: 'Search Messages',
            value: 'searchMessages',
            description:
              'Find messages containing text. Input: channelId (required), searchQuery (required), limit (optional)',
          },
          {
            name: 'Get Server Info',
            value: 'getServerInfo',
            description: 'Get Discord server information. Input: serverId (required)',
          },
          {
            name: 'List My Servers',
            value: 'listServers',
            description: 'Get all servers you belong to. No input required',
          },
          {
            name: 'List Channels',
            value: 'listChannels',
            description: 'Get all channels in a server. Input: serverId (required)',
          },
          {
            name: 'List Members',
            value: 'listMembers',
            description: 'Get server members. Input: serverId (required), limit (optional)',
          },
          {
            name: 'Get User Info',
            value: 'getUserInfo',
            description: 'Get Discord user information. Input: userId (required)',
          },
          {
            name: 'Set Status',
            value: 'setStatus',
            description:
              'Set your online status. Input: status (required: online/idle/dnd/invisible)',
          },
          {
            name: 'Join Server',
            value: 'joinServer',
            description: 'Join a server with invite code. Input: inviteCode (required)',
          },
          {
            name: 'Leave Server',
            value: 'leaveServer',
            description: 'Leave a Discord server. Input: serverId (required)',
          },
        ],
        default: 'sendMessage',
        placeholder: 'Select operation...',
      },
      {
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        default: '',
        description:
          'The Discord channel ID (enable Developer Mode in Discord settings > Advanced)',
        displayOptions: {
          show: {
            operation: [
              'sendMessage',
              'readMessages',
              'editMessage',
              'deleteMessage',
              'addReaction',
              'searchMessages',
            ],
          },
        },
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        description: 'The Discord user ID (right-click user > Copy ID with Developer Mode enabled)',
        displayOptions: {
          show: {
            operation: ['sendDM', 'getUserInfo'],
          },
        },
      },
      {
        displayName: 'Message Content',
        name: 'content',
        type: 'string',
        default: '',
        typeOptions: {
          rows: 4,
        },
        description: 'The text content of your message',
        displayOptions: {
          show: {
            operation: ['sendMessage', 'sendDM'],
          },
        },
      },
      {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        default: '',
        description: 'The ID of the message to edit, delete, or react to',
        displayOptions: {
          show: {
            operation: ['editMessage', 'deleteMessage', 'addReaction'],
          },
        },
      },
      {
        displayName: 'New Content',
        name: 'newContent',
        type: 'string',
        default: '',
        typeOptions: {
          rows: 4,
        },
        description: 'The new text content for the message',
        displayOptions: {
          show: {
            operation: ['editMessage'],
          },
        },
      },
      {
        displayName: 'Emoji',
        name: 'emoji',
        type: 'string',
        default: '👍',
        description: 'Emoji to add (e.g., 👍, ❤️, 🎉, or custom emoji name:emoji)',
        displayOptions: {
          show: {
            operation: ['addReaction'],
          },
        },
      },
      {
        displayName: 'Server ID',
        name: 'serverId',
        type: 'string',
        default: '',
        description: 'The Discord server (guild) ID (right-click server name > Copy ID)',
        displayOptions: {
          show: {
            operation: ['getServerInfo', 'listChannels', 'listMembers', 'leaveServer'],
          },
        },
      },
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Text to search for in messages',
        displayOptions: {
          show: {
            operation: ['searchMessages'],
          },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 10,
        description: 'Maximum number of results to return (1-100)',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        displayOptions: {
          show: {
            operation: ['readMessages', 'listMembers', 'searchMessages'],
          },
        },
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: 'online',
        description: 'Your online status',
        displayOptions: {
          show: {
            operation: ['setStatus'],
          },
        },
        options: [
          { name: 'Online 🟢', value: 'online' },
          { name: 'Idle 🌙', value: 'idle' },
          { name: 'Do Not Disturb 🔴', value: 'dnd' },
          { name: 'Invisible ⚫', value: 'invisible' },
        ],
      },
      {
        displayName: 'Invite Code',
        name: 'inviteCode',
        type: 'string',
        default: '',
        description: 'The invite code (e.g., "abc123" from discord.gg/abc123)',
        displayOptions: {
          show: {
            operation: ['joinServer'],
          },
        },
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
          const operation = this.getNodeParameter('operation', i) as string;
          let result: IDataObject | IDataObject[];

          switch (operation) {
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
                operation: 'sendMessage',
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
                operation: 'sendDM',
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
                operation: 'readMessages',
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
                operation: 'editMessage',
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
                operation: 'deleteMessage',
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
                operation: 'addReaction',
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
                operation: 'getServerInfo',
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
                operation: 'listServers',
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
                  operation: 'listChannels',
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
                operation: 'listMembers',
                userId: m.id,
                username: m.user.username,
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
                operation: 'getUserInfo',
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
                operation: 'searchMessages',
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
                operation: 'setStatus',
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
                operation: 'joinServer',
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
                operation: 'leaveServer',
                success: true,
                leftServerId: serverId,
              };
              break;
            }

            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
          }

          if (Array.isArray(result)) {
            result.forEach((item) =>
              returnData.push({
                json: { tool: 'discordUserTool', ...item },
                pairedItem: { item: i },
              }),
            );
          } else {
            returnData.push({
              json: { tool: 'discordUserTool', ...result },
              pairedItem: { item: i },
            });
          }
        } catch (error) {
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                tool: 'discordUserTool',
                error: error instanceof Error ? error.message : String(error),
              },
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
