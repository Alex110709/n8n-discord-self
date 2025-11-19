import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { Client, TextChannel, DMChannel } from 'discord.js-selfbot-v13';
import {
  operations,
  messageOperations,
  userProfileOperations,
  serverOperations,
  channelOperations,
  roleOperations,
  memberOperations,
  presenceOperations,
  inviteOperations,
} from './operations';
import {
  messageFields,
  userProfileFields,
  serverFields,
  channelFields,
  roleFields,
  memberFields,
  presenceFields,
  inviteFields,
} from './descriptions';

export class DiscordSelfV2 implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Discord Self-Bot V2',
    name: 'discordSelfV2',
    icon: 'file:discord.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
    description: 'Interact with Discord - Full API functionality (user profiles, servers, roles, members)',
    defaults: {
      name: 'Discord Self-Bot V2',
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
      ...operations,
      ...messageOperations,
      ...userProfileOperations,
      ...serverOperations,
      ...channelOperations,
      ...roleOperations,
      ...memberOperations,
      ...presenceOperations,
      ...inviteOperations,
      ...messageFields,
      ...userProfileFields,
      ...serverFields,
      ...channelFields,
      ...roleFields,
      ...memberFields,
      ...presenceFields,
      ...inviteFields,
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
          const resource = this.getNodeParameter('resource', i) as string;
          const operation = this.getNodeParameter('operation', i) as string;
          let result: any;

          // Handle operations
          if (resource === 'message') {
            if (operation === 'send') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const content = this.getNodeParameter('content', i, '') as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('send' in channel)) throw new NodeOperationError(this.getNode(), 'Invalid channel');
              const message = await (channel as TextChannel | DMChannel).send(content || ' ');
              result = { messageId: message.id, channelId: message.channelId, content: message.content };
            } else if (operation === 'read') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const limit = this.getNodeParameter('limit', i) as number;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) throw new NodeOperationError(this.getNode(), 'Invalid channel');
              const messages = await (channel as TextChannel | DMChannel).messages.fetch({ limit });
              result = Array.from(messages.values()).map((m) => ({ messageId: m.id, content: m.content, author: m.author.username }));
            }
          } else if (resource === 'userProfile') {
            if (operation === 'getProfile') {
              const userId = this.getNodeParameter('userId', i, '') as string;
              const user = userId ? await client.users.fetch(userId) : client.user;
              result = { id: user?.id, username: user?.username, avatar: user?.avatar };
            } else if (operation === 'updateStatus') {
              const status = this.getNodeParameter('status', i) as any;
              await client.user?.setStatus(status);
              result = { success: true, status };
            }
          } else if (resource === 'server') {
            const serverId = this.getNodeParameter('serverId', i, '') as string;
            if (operation === 'getInfo' && serverId) {
              const guild = await client.guilds.fetch(serverId);
              result = { id: guild.id, name: guild.name, memberCount: guild.memberCount };
            } else if (operation === 'listServers') {
              const guilds = await client.guilds.fetch();
              result = Array.from(guilds.values()).map((g) => ({ id: g.id, name: g.name }));
            }
          } else if (resource === 'channel') {
            const serverId = this.getNodeParameter('serverId', i, '') as string;
            if (operation === 'listChannels' && serverId) {
              const guild = await client.guilds.fetch(serverId);
              const channels = await guild.channels.fetch();
              result = Array.from(channels.values()).filter((c) => c !== null).map((c) => ({ id: c!.id, name: c!.name, type: c!.type }));
            }
          } else if (resource === 'role') {
            const serverId = this.getNodeParameter('serverId', i) as string;
            const guild = await client.guilds.fetch(serverId);
            if (operation === 'listRoles') {
              const roles = await guild.roles.fetch();
              result = Array.from(roles.values()).map((r) => ({ id: r.id, name: r.name, color: r.hexColor }));
            }
          } else if (resource === 'member') {
            const serverId = this.getNodeParameter('serverId', i) as string;
            const guild = await client.guilds.fetch(serverId);
            if (operation === 'listMembers') {
              const limit = this.getNodeParameter('limit', i, 100) as number;
              const members = await guild.members.fetch({ limit });
              result = Array.from(members.values()).map((m) => ({ id: m.id, username: m.user.username, nickname: m.nickname }));
            }
          } else if (resource === 'presence') {
            if (operation === 'setStatus') {
              const status = this.getNodeParameter('status', i) as any;
              await client.user?.setStatus(status);
              result = { success: true, status };
            }
          } else if (resource === 'invite') {
            if (operation === 'acceptInvite') {
              const inviteCode = this.getNodeParameter('inviteCode', i) as string;
              const invite = await client.fetchInvite(inviteCode);
              await invite.acceptInvite();
              result = { success: true, code: inviteCode };
            }
          }

          if (Array.isArray(result)) {
            result.forEach((item) => returnData.push({ json: item, pairedItem: { item: i } }));
          } else if (result) {
            returnData.push({ json: result, pairedItem: { item: i } });
          }
        } catch (error) {
          if (this.continueOnFail()) {
            returnData.push({ json: { error: error instanceof Error ? error.message : String(error) }, pairedItem: { item: i } });
            continue;
          }
          throw error;
        }
      }
      await client.destroy();
    } catch (error) {
      await client.destroy();
      throw new NodeOperationError(this.getNode(), `Discord error: ${error instanceof Error ? error.message : String(error)}`);
    }
    return [returnData];
  }
}
