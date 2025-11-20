import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { Client, TextChannel, DMChannel, Options } from 'discord.js-selfbot-v13';
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
} from '../DiscordSelf/operations';
import {
  messageFields,
  userProfileFields,
  serverFields,
  channelFields,
  roleFields,
  memberFields,
  presenceFields,
  inviteFields,
} from '../DiscordSelf/descriptions';

export class DiscordUser implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Discord User',
    name: 'discordUser',
    icon: 'file:discord.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"]}} - {{$parameter["operation"]}}',
    description: 'Complete Discord automation - Messages, Servers, Roles, Members, DMs',
    defaults: {
      name: 'Discord User',
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

    const client = new Client({ 
      checkUpdate: false,
      makeCache: Options.cacheWithLimits({
        MessageManager: 200,
      }),
    });

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
              const embedJson = this.getNodeParameter('embed', i, '') as string;

              const channel = await client.channels.fetch(channelId);
              if (!channel || !('send' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }

              const messageOptions: any = {};
              if (content) messageOptions.content = content;
              if (embedJson) {
                try {
                  messageOptions.embeds = [JSON.parse(embedJson)];
                } catch (e) {
                  throw new NodeOperationError(this.getNode(), 'Invalid embed JSON');
                }
              }

              const message = await (channel as TextChannel | DMChannel).send(messageOptions);
              result = {
                messageId: message.id,
                channelId: message.channelId,
                content: message.content,
                createdAt: message.createdAt,
              };
            } else if (operation === 'sendDM') {
              const targetUserId = this.getNodeParameter('targetUserId', i) as string;
              const content = this.getNodeParameter('content', i, '') as string;
              const embedJson = this.getNodeParameter('embed', i, '') as string;

              // Fetch the user and create/get DM channel
              const user = await client.users.fetch(targetUserId);
              if (!user) {
                throw new NodeOperationError(this.getNode(), `User with ID ${targetUserId} not found`);
              }

              const dmChannel = await user.createDM();

              const messageOptions: any = {};
              if (content) messageOptions.content = content;
              if (embedJson) {
                try {
                  messageOptions.embeds = [JSON.parse(embedJson)];
                } catch (e) {
                  throw new NodeOperationError(this.getNode(), 'Invalid embed JSON');
                }
              }

              const message = await dmChannel.send(messageOptions);
              result = {
                messageId: message.id,
                channelId: message.channelId,
                userId: targetUserId,
                content: message.content,
                createdAt: message.createdAt,
                isDM: true,
              };
            } else if (operation === 'read') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const limit = this.getNodeParameter('limit', i) as number;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }
              const messages = await (channel as TextChannel | DMChannel).messages.fetch({ limit });
              result = Array.from(messages.values()).map((m) => ({
                messageId: m.id,
                content: m.content,
                author: m.author.username,
                createdAt: m.createdAt,
              }));
            } else if (operation === 'edit') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const newContent = this.getNodeParameter('newContent', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }
              const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
              const edited = await message.edit(newContent);
              result = { messageId: edited.id, content: edited.content, editedAt: edited.editedAt };
            } else if (operation === 'delete') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }
              const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
              await message.delete();
              result = { success: true, messageId, deleted: true };
            } else if (operation === 'react') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const emoji = this.getNodeParameter('emoji', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }
              const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
              await message.react(emoji);
              result = { success: true, messageId, emoji };
            } else if (operation === 'pin') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }
              const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
              await message.pin();
              result = { success: true, messageId, pinned: true };
            } else if (operation === 'unpin') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const messageId = this.getNodeParameter('messageId', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }
              const message = await (channel as TextChannel | DMChannel).messages.fetch(messageId);
              await message.unpin();
              result = { success: true, messageId, unpinned: true };
            } else if (operation === 'search') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const searchQuery = this.getNodeParameter('searchQuery', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (!channel || !('messages' in channel)) {
                throw new NodeOperationError(this.getNode(), 'Invalid channel');
              }
              const messages = await (channel as TextChannel | DMChannel).messages.fetch({ limit: 100 });
              const filtered = Array.from(messages.values()).filter((msg) =>
                msg.content.toLowerCase().includes(searchQuery.toLowerCase())
              );
              result = filtered.map((m) => ({
                messageId: m.id,
                content: m.content,
                author: m.author.username,
              }));
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
            } else if (operation === 'updateBio') {
              const bio = this.getNodeParameter('bio', i) as string;
              await client.user?.setAboutMe(bio);
              result = { success: true, bio };
            } else if (operation === 'updateAvatar') {
              const avatarUrl = this.getNodeParameter('avatarUrl', i) as string;
              await client.user?.setAvatar(avatarUrl);
              result = { success: true, avatarUrl };
            } else if (operation === 'updateUsername') {
              const username = this.getNodeParameter('username', i) as string;
              if (client.user) {
                await client.user.setUsername(username, '');
              }
              result = { success: true, username };
            }
          } else if (resource === 'server') {
            const serverId = this.getNodeParameter('serverId', i, '') as string;
            if (operation === 'getInfo' && serverId) {
              const guild = await client.guilds.fetch(serverId);
              result = { id: guild.id, name: guild.name, memberCount: guild.memberCount };
            } else if (operation === 'listServers') {
              const guilds = await client.guilds.fetch();
              result = Array.from(guilds.values()).map((g) => ({ id: g.id, name: g.name }));
            } else if (operation === 'createServer') {
              const serverName = this.getNodeParameter('serverName', i) as string;
              const guild = await client.guilds.create(serverName);
              result = { id: guild.id, name: guild.name };
            } else if (operation === 'updateServer' && serverId) {
              const serverName = this.getNodeParameter('serverName', i) as string;
              const guild = await client.guilds.fetch(serverId);
              await guild.setName(serverName);
              result = { success: true, serverId, name: serverName };
            } else if (operation === 'deleteServer' && serverId) {
              const guild = await client.guilds.fetch(serverId);
              await guild.delete();
              result = { success: true, serverId, deleted: true };
            } else if (operation === 'leaveServer' && serverId) {
              const guild = await client.guilds.fetch(serverId);
              await guild.leave();
              result = { success: true, serverId, left: true };
            }
          } else if (resource === 'channel') {
            const serverId = this.getNodeParameter('serverId', i, '') as string;
            if (operation === 'listChannels' && serverId) {
              const guild = await client.guilds.fetch(serverId);
              const channels = await guild.channels.fetch();
              result = Array.from(channels.values())
                .filter((c) => c !== null)
                .map((c) => ({ id: c!.id, name: c!.name, type: c!.type }));
            } else if (operation === 'getInfo') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const channel = await client.channels.fetch(channelId);
              result = {
                id: channel?.id,
                type: channel?.type,
                name: 'name' in channel! ? channel.name : undefined,
              };
            } else if (operation === 'createChannel' && serverId) {
              const channelName = this.getNodeParameter('channelName', i) as string;
              const guild = await client.guilds.fetch(serverId);
              const channel = await guild.channels.create(channelName);
              result = { id: channel.id, name: channel.name };
            } else if (operation === 'deleteChannel') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const channel = await client.channels.fetch(channelId);
              if (channel && 'delete' in channel) {
                await channel.delete();
                result = { success: true, channelId, deleted: true };
              }
            }
          } else if (resource === 'role') {
            const serverId = this.getNodeParameter('serverId', i) as string;
            const guild = await client.guilds.fetch(serverId);
            if (operation === 'listRoles') {
              const roles = await guild.roles.fetch();
              result = Array.from(roles.values()).map((r) => ({
                id: r.id,
                name: r.name,
                color: r.hexColor,
              }));
            } else if (operation === 'createRole') {
              const roleName = this.getNodeParameter('roleName', i) as string;
              const role = await guild.roles.create({ name: roleName });
              result = { id: role.id, name: role.name, color: role.hexColor };
            } else if (operation === 'assignRole') {
              const roleId = this.getNodeParameter('roleId', i) as string;
              const memberId = this.getNodeParameter('memberId', i) as string;
              const member = await guild.members.fetch(memberId);
              await member.roles.add(roleId);
              result = { success: true, memberId, roleId };
            } else if (operation === 'removeRole') {
              const roleId = this.getNodeParameter('roleId', i) as string;
              const memberId = this.getNodeParameter('memberId', i) as string;
              const member = await guild.members.fetch(memberId);
              await member.roles.remove(roleId);
              result = { success: true, memberId, roleId };
            }
          } else if (resource === 'member') {
            const serverId = this.getNodeParameter('serverId', i) as string;
            const guild = await client.guilds.fetch(serverId);
            if (operation === 'listMembers') {
              const limit = this.getNodeParameter('limit', i, 100) as number;
              const members = await guild.members.fetch({ limit });
              result = Array.from(members.values()).map((m) => ({
                id: m.id,
                username: m.user.username,
                nickname: m.nickname,
              }));
            } else if (operation === 'getInfo') {
              const memberId = this.getNodeParameter('memberId', i) as string;
              const member = await guild.members.fetch(memberId);
              result = {
                id: member.id,
                username: member.user.username,
                nickname: member.nickname,
                roles: member.roles.cache.map((r) => ({ id: r.id, name: r.name })),
              };
            } else if (operation === 'kickMember') {
              const memberId = this.getNodeParameter('memberId', i) as string;
              const reason = this.getNodeParameter('reason', i, '') as string;
              const member = await guild.members.fetch(memberId);
              await member.kick(reason);
              result = { success: true, memberId, kicked: true };
            } else if (operation === 'banMember') {
              const memberId = this.getNodeParameter('memberId', i) as string;
              const reason = this.getNodeParameter('reason', i, '') as string;
              await guild.members.ban(memberId, { reason });
              result = { success: true, memberId, banned: true };
            }
          } else if (resource === 'presence') {
            if (operation === 'setStatus') {
              const status = this.getNodeParameter('status', i) as any;
              await client.user?.setStatus(status);
              result = { success: true, status };
            } else if (operation === 'setActivity') {
              const activityName = this.getNodeParameter('activityName', i) as string;
              await client.user?.setActivity(activityName);
              result = { success: true, activityName };
            }
          } else if (resource === 'invite') {
            if (operation === 'createInvite') {
              const channelId = this.getNodeParameter('channelId', i) as string;
              const maxAge = this.getNodeParameter('maxAge', i, 86400) as number;
              const maxUses = this.getNodeParameter('maxUses', i, 0) as number;
              const channel = await client.channels.fetch(channelId);
              if (channel && 'createInvite' in channel) {
                const invite = await channel.createInvite({ maxAge, maxUses });
                result = { code: invite.code, url: invite.url };
              }
            } else if (operation === 'acceptInvite') {
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
