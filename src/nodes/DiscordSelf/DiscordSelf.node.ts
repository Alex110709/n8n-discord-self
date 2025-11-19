import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { Client, Message, TextChannel, DMChannel } from 'discord.js-selfbot-v13';

export class DiscordSelf implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Discord Self-Bot',
    name: 'discordSelf',
    icon: 'file:discord.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with Discord as a user account',
    defaults: {
      name: 'Discord Self-Bot',
    },
    inputs: ['main'],
    outputs: ['main'],
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
            description: 'Send a message to a channel',
            action: 'Send a message',
          },
          {
            name: 'Read Messages',
            value: 'readMessages',
            description: 'Read messages from a channel',
            action: 'Read messages',
          },
          {
            name: 'React to Message',
            value: 'reactMessage',
            description: 'Add a reaction to a message',
            action: 'React to a message',
          },
          {
            name: 'Delete Message',
            value: 'deleteMessage',
            description: 'Delete a message',
            action: 'Delete a message',
          },
          {
            name: 'Edit Message',
            value: 'editMessage',
            description: 'Edit a message',
            action: 'Edit a message',
          },
          {
            name: 'Get User Info',
            value: 'getUserInfo',
            description: 'Get information about a user',
            action: 'Get user information',
          },
        ],
        default: 'sendMessage',
      },
      // Send Message
      {
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendMessage', 'readMessages'],
          },
        },
        default: '',
        required: true,
        description: 'The ID of the channel to send the message to',
      },
      {
        displayName: 'Message Content',
        name: 'content',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['sendMessage'],
          },
        },
        default: '',
        required: true,
        description: 'The content of the message to send',
        typeOptions: {
          rows: 4,
        },
      },
      // Read Messages
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['readMessages'],
          },
        },
        default: 10,
        description: 'Number of messages to retrieve',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
      },
      // React to Message
      {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['reactMessage', 'deleteMessage', 'editMessage'],
          },
        },
        default: '',
        required: true,
        description: 'The ID of the message',
      },
      {
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['reactMessage', 'deleteMessage', 'editMessage'],
          },
        },
        default: '',
        required: true,
        description: 'The ID of the channel containing the message',
      },
      {
        displayName: 'Emoji',
        name: 'emoji',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['reactMessage'],
          },
        },
        default: '👍',
        required: true,
        description: 'The emoji to react with',
      },
      // Edit Message
      {
        displayName: 'New Content',
        name: 'newContent',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['editMessage'],
          },
        },
        default: '',
        required: true,
        description: 'The new content for the message',
        typeOptions: {
          rows: 4,
        },
      },
      // Get User Info
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['getUserInfo'],
          },
        },
        default: '',
        required: true,
        description: 'The ID of the user to get information about',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials('discordSelfApi');
    const token = credentials.token as string;

    const client = new Client({
      checkUpdate: false,
    });

    try {
      await client.login(token);

      for (let i = 0; i < items.length; i++) {
        try {
          const operation = this.getNodeParameter('operation', i) as string;

          if (operation === 'sendMessage') {
            const channelId = this.getNodeParameter('channelId', i) as string;
            const content = this.getNodeParameter('content', i) as string;

            const channel = await client.channels.fetch(channelId);
            if (!channel || !('send' in channel)) {
              throw new NodeOperationError(this.getNode(), 'Invalid channel or cannot send messages to this channel');
            }

            const message = await (channel as TextChannel | DMChannel).send(content);

            returnData.push({
              json: {
                messageId: message.id,
                channelId: message.channelId,
                content: message.content,
                createdAt: message.createdAt,
                author: {
                  id: message.author.id,
                  username: message.author.username,
                  discriminator: message.author.discriminator,
                },
              },
              pairedItem: { item: i },
            });
          } else if (operation === 'readMessages') {
            const channelId = this.getNodeParameter('channelId', i) as string;
            const limit = this.getNodeParameter('limit', i) as number;

            const channel = await client.channels.fetch(channelId);
            if (!channel || !('messages' in channel)) {
              throw new NodeOperationError(this.getNode(), 'Invalid channel or cannot read messages from this channel');
            }

            const messages = await (channel as TextChannel | DMChannel).messages.fetch({ limit });

            messages.forEach((message: Message) => {
              returnData.push({
                json: {
                  messageId: message.id,
                  channelId: message.channelId,
                  content: message.content,
                  createdAt: message.createdAt,
                  author: {
                    id: message.author.id,
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                  },
                  attachments: message.attachments.map((att) => ({
                    id: att.id,
                    url: att.url,
                    name: att.name,
                    size: att.size,
                  })),
                },
                pairedItem: { item: i },
              });
            });
          } else if (operation === 'reactMessage') {
            const channelId = this.getNodeParameter('channelId', i) as string;
            const messageId = this.getNodeParameter('messageId', i) as string;
            const emoji = this.getNodeParameter('emoji', i) as string;

            const channel = await client.channels.fetch(channelId);
            if (!channel || !('messages' in channel)) {
              throw new NodeOperationError(this.getNode(), 'Invalid channel');
            }

            const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
            await message.react(emoji);

            returnData.push({
              json: {
                success: true,
                messageId: message.id,
                emoji,
              },
              pairedItem: { item: i },
            });
          } else if (operation === 'deleteMessage') {
            const channelId = this.getNodeParameter('channelId', i) as string;
            const messageId = this.getNodeParameter('messageId', i) as string;

            const channel = await client.channels.fetch(channelId);
            if (!channel || !('messages' in channel)) {
              throw new NodeOperationError(this.getNode(), 'Invalid channel');
            }

            const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
            await message.delete();

            returnData.push({
              json: {
                success: true,
                messageId,
                deleted: true,
              },
              pairedItem: { item: i },
            });
          } else if (operation === 'editMessage') {
            const channelId = this.getNodeParameter('channelId', i) as string;
            const messageId = this.getNodeParameter('messageId', i) as string;
            const newContent = this.getNodeParameter('newContent', i) as string;

            const channel = await client.channels.fetch(channelId);
            if (!channel || !('messages' in channel)) {
              throw new NodeOperationError(this.getNode(), 'Invalid channel');
            }

            const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
            const editedMessage = await message.edit(newContent);

            returnData.push({
              json: {
                messageId: editedMessage.id,
                content: editedMessage.content,
                editedAt: editedMessage.editedAt,
              },
              pairedItem: { item: i },
            });
          } else if (operation === 'getUserInfo') {
            const userId = this.getNodeParameter('userId', i) as string;

            const user = await client.users.fetch(userId);

            returnData.push({
              json: {
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
                bot: user.bot,
                avatar: user.avatar,
                avatarURL: user.displayAvatarURL(),
                createdAt: user.createdAt,
              },
              pairedItem: { item: i },
            });
          }
        } catch (error) {
          if (this.continueOnFail()) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            returnData.push({
              json: {
                error: errorMessage,
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new NodeOperationError(this.getNode(), `Discord Self-Bot error: ${errorMessage}`);
    }

    return [returnData];
  }
}
