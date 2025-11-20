import { INodeProperties } from 'n8n-workflow';

export const operations: INodeProperties[] = [
  {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
      {
        name: 'Message',
        value: 'message',
      },
      {
        name: 'User Profile',
        value: 'userProfile',
      },
      {
        name: 'Server',
        value: 'server',
      },
      {
        name: 'Channel',
        value: 'channel',
      },
      {
        name: 'Role',
        value: 'role',
      },
      {
        name: 'Member',
        value: 'member',
      },
      {
        name: 'Presence',
        value: 'presence',
      },
      {
        name: 'Invite',
        value: 'invite',
      },
    ],
    default: 'message',
  },
];

export const messageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    options: [
      {
        name: 'Send',
        value: 'send',
        description: 'Send a message to a channel',
        action: 'Send a message',
      },
      {
        name: 'Send DM',
        value: 'sendDM',
        description: 'Send a direct message to a user',
        action: 'Send a direct message',
      },
      {
        name: 'Read',
        value: 'read',
        description: 'Read messages',
        action: 'Read messages',
      },
      {
        name: 'Edit',
        value: 'edit',
        description: 'Edit a message',
        action: 'Edit a message',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a message',
        action: 'Delete a message',
      },
      {
        name: 'React',
        value: 'react',
        description: 'Add reaction to message',
        action: 'React to message',
      },
      {
        name: 'Pin',
        value: 'pin',
        description: 'Pin a message',
        action: 'Pin a message',
      },
      {
        name: 'Unpin',
        value: 'unpin',
        description: 'Unpin a message',
        action: 'Unpin a message',
      },
      {
        name: 'Search',
        value: 'search',
        description: 'Search messages',
        action: 'Search messages',
      },
    ],
    default: 'send',
  },
];

export const userProfileOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['userProfile'],
      },
    },
    options: [
      {
        name: 'Get Profile',
        value: 'getProfile',
        description: 'Get user profile information',
        action: 'Get profile',
      },
      {
        name: 'Update Status',
        value: 'updateStatus',
        description: 'Update user status',
        action: 'Update status',
      },
      {
        name: 'Update Bio',
        value: 'updateBio',
        description: 'Update user bio',
        action: 'Update bio',
      },
      {
        name: 'Update Avatar',
        value: 'updateAvatar',
        description: 'Update user avatar',
        action: 'Update avatar',
      },
      {
        name: 'Update Username',
        value: 'updateUsername',
        description: 'Update username',
        action: 'Update username',
      },
    ],
    default: 'getProfile',
  },
];

export const serverOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['server'],
      },
    },
    options: [
      {
        name: 'Get Info',
        value: 'getInfo',
        description: 'Get server information',
        action: 'Get server info',
      },
      {
        name: 'List Servers',
        value: 'listServers',
        description: 'List all servers',
        action: 'List servers',
      },
      {
        name: 'Create Server',
        value: 'createServer',
        description: 'Create a new server',
        action: 'Create server',
      },
      {
        name: 'Update Server',
        value: 'updateServer',
        description: 'Update server settings',
        action: 'Update server',
      },
      {
        name: 'Delete Server',
        value: 'deleteServer',
        description: 'Delete a server',
        action: 'Delete server',
      },
      {
        name: 'Leave Server',
        value: 'leaveServer',
        description: 'Leave a server',
        action: 'Leave server',
      },
    ],
    default: 'getInfo',
  },
];

export const channelOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['channel'],
      },
    },
    options: [
      {
        name: 'Get Info',
        value: 'getInfo',
        description: 'Get channel information',
        action: 'Get channel info',
      },
      {
        name: 'List Channels',
        value: 'listChannels',
        description: 'List server channels',
        action: 'List channels',
      },
      {
        name: 'Create Channel',
        value: 'createChannel',
        description: 'Create a new channel',
        action: 'Create channel',
      },
      {
        name: 'Update Channel',
        value: 'updateChannel',
        description: 'Update channel settings',
        action: 'Update channel',
      },
      {
        name: 'Delete Channel',
        value: 'deleteChannel',
        description: 'Delete a channel',
        action: 'Delete channel',
      },
    ],
    default: 'getInfo',
  },
];

export const roleOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['role'],
      },
    },
    options: [
      {
        name: 'List Roles',
        value: 'listRoles',
        description: 'List server roles',
        action: 'List roles',
      },
      {
        name: 'Create Role',
        value: 'createRole',
        description: 'Create a new role',
        action: 'Create role',
      },
      {
        name: 'Update Role',
        value: 'updateRole',
        description: 'Update role settings',
        action: 'Update role',
      },
      {
        name: 'Delete Role',
        value: 'deleteRole',
        description: 'Delete a role',
        action: 'Delete role',
      },
      {
        name: 'Assign Role',
        value: 'assignRole',
        description: 'Assign role to member',
        action: 'Assign role',
      },
      {
        name: 'Remove Role',
        value: 'removeRole',
        description: 'Remove role from member',
        action: 'Remove role',
      },
    ],
    default: 'listRoles',
  },
];

export const memberOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['member'],
      },
    },
    options: [
      {
        name: 'Get Info',
        value: 'getInfo',
        description: 'Get member information',
        action: 'Get member info',
      },
      {
        name: 'List Members',
        value: 'listMembers',
        description: 'List server members',
        action: 'List members',
      },
      {
        name: 'Kick Member',
        value: 'kickMember',
        description: 'Kick a member',
        action: 'Kick member',
      },
      {
        name: 'Ban Member',
        value: 'banMember',
        description: 'Ban a member',
        action: 'Ban member',
      },
      {
        name: 'Unban Member',
        value: 'unbanMember',
        description: 'Unban a member',
        action: 'Unban member',
      },
      {
        name: 'Update Nickname',
        value: 'updateNickname',
        description: 'Update member nickname',
        action: 'Update nickname',
      },
    ],
    default: 'getInfo',
  },
];

export const presenceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['presence'],
      },
    },
    options: [
      {
        name: 'Set Status',
        value: 'setStatus',
        description: 'Set presence status',
        action: 'Set status',
      },
      {
        name: 'Set Activity',
        value: 'setActivity',
        description: 'Set activity (playing, streaming, etc)',
        action: 'Set activity',
      },
      {
        name: 'Clear Presence',
        value: 'clearPresence',
        description: 'Clear presence',
        action: 'Clear presence',
      },
    ],
    default: 'setStatus',
  },
];

export const inviteOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['invite'],
      },
    },
    options: [
      {
        name: 'Create Invite',
        value: 'createInvite',
        description: 'Create channel invite',
        action: 'Create invite',
      },
      {
        name: 'Accept Invite',
        value: 'acceptInvite',
        description: 'Accept server invite',
        action: 'Accept invite',
      },
      {
        name: 'Get Invites',
        value: 'getInvites',
        description: 'Get channel invites',
        action: 'Get invites',
      },
      {
        name: 'Delete Invite',
        value: 'deleteInvite',
        description: 'Delete an invite',
        action: 'Delete invite',
      },
    ],
    default: 'createInvite',
  },
];
