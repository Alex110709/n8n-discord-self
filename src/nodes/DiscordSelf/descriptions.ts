import { INodeProperties } from 'n8n-workflow';

// Message Fields
export const messageFields: INodeProperties[] = [
  // Send Message
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send', 'read', 'search'],
      },
    },
    default: '',
    required: true,
  },
  // Send DM
  {
    displayName: 'User ID',
    name: 'targetUserId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendDM'],
      },
    },
    default: '',
    required: true,
    description: 'Discord user ID to send DM to',
  },
  {
    displayName: 'Message Content',
    name: 'content',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send', 'sendDM'],
      },
    },
    default: '',
    typeOptions: {
      rows: 4,
    },
  },
  {
    displayName: 'Embed',
    name: 'embed',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send', 'sendDM'],
      },
    },
    default: '',
    description: 'Embed object in JSON format',
  },
  // Read/Edit/Delete Message
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['edit', 'delete', 'react', 'pin', 'unpin'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['edit', 'delete', 'react', 'pin', 'unpin'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'New Content',
    name: 'newContent',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['edit'],
      },
    },
    default: '',
    required: true,
    typeOptions: {
      rows: 4,
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['read'],
      },
    },
    default: 10,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
  },
  {
    displayName: 'Emoji',
    name: 'emoji',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['react'],
      },
    },
    default: '👍',
    required: true,
  },
  {
    displayName: 'Search Query',
    name: 'searchQuery',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['search'],
      },
    },
    default: '',
    required: true,
  },
];

// User Profile Fields
export const userProfileFields: INodeProperties[] = [
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['userProfile'],
        operation: ['getProfile'],
      },
    },
    default: '',
    description: 'Leave empty for current user',
  },
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['userProfile'],
        operation: ['updateStatus'],
      },
    },
    options: [
      { name: 'Online', value: 'online' },
      { name: 'Idle', value: 'idle' },
      { name: 'Do Not Disturb', value: 'dnd' },
      { name: 'Invisible', value: 'invisible' },
    ],
    default: 'online',
    required: true,
  },
  {
    displayName: 'Bio',
    name: 'bio',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['userProfile'],
        operation: ['updateBio'],
      },
    },
    default: '',
    typeOptions: {
      rows: 3,
    },
  },
  {
    displayName: 'Avatar URL',
    name: 'avatarUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['userProfile'],
        operation: ['updateAvatar'],
      },
    },
    default: '',
    description: 'URL or base64 data of the new avatar',
  },
  {
    displayName: 'Username',
    name: 'username',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['userProfile'],
        operation: ['updateUsername'],
      },
    },
    default: '',
    required: true,
  },
];

// Server Fields
export const serverFields: INodeProperties[] = [
  {
    displayName: 'Server ID',
    name: 'serverId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['server'],
        operation: ['getInfo', 'updateServer', 'deleteServer', 'leaveServer'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Server Name',
    name: 'serverName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['server'],
        operation: ['createServer', 'updateServer'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Icon URL',
    name: 'iconUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['server'],
        operation: ['createServer', 'updateServer'],
      },
    },
    default: '',
  },
];

// Channel Fields
export const channelFields: INodeProperties[] = [
  {
    displayName: 'Server ID',
    name: 'serverId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['channel'],
        operation: ['listChannels', 'createChannel'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['channel'],
        operation: ['getInfo', 'updateChannel', 'deleteChannel'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Channel Name',
    name: 'channelName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['channel'],
        operation: ['createChannel', 'updateChannel'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Channel Type',
    name: 'channelType',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['channel'],
        operation: ['createChannel'],
      },
    },
    options: [
      { name: 'Text', value: 0 },
      { name: 'Voice', value: 2 },
      { name: 'Category', value: 4 },
      { name: 'Announcement', value: 5 },
    ],
    default: 0,
  },
  {
    displayName: 'Topic',
    name: 'topic',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['channel'],
        operation: ['createChannel', 'updateChannel'],
      },
    },
    default: '',
  },
];

// Role Fields
export const roleFields: INodeProperties[] = [
  {
    displayName: 'Server ID',
    name: 'serverId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['role'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Role ID',
    name: 'roleId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['updateRole', 'deleteRole', 'assignRole', 'removeRole'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Role Name',
    name: 'roleName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['createRole', 'updateRole'],
      },
    },
    default: '',
  },
  {
    displayName: 'Color',
    name: 'color',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['createRole', 'updateRole'],
      },
    },
    default: '#000000',
    description: 'Hex color code',
  },
  {
    displayName: 'Member ID',
    name: 'memberId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['assignRole', 'removeRole'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Permissions',
    name: 'permissions',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['role'],
        operation: ['createRole', 'updateRole'],
      },
    },
    default: '',
    description: 'Permission bitfield',
  },
];

// Member Fields
export const memberFields: INodeProperties[] = [
  {
    displayName: 'Server ID',
    name: 'serverId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['member'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Member ID',
    name: 'memberId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['member'],
        operation: ['getInfo', 'kickMember', 'banMember', 'updateNickname'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['member'],
        operation: ['unbanMember'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Reason',
    name: 'reason',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['member'],
        operation: ['kickMember', 'banMember'],
      },
    },
    default: '',
  },
  {
    displayName: 'Nickname',
    name: 'nickname',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['member'],
        operation: ['updateNickname'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['member'],
        operation: ['listMembers'],
      },
    },
    default: 100,
    typeOptions: {
      minValue: 1,
      maxValue: 1000,
    },
  },
];

// Presence Fields
export const presenceFields: INodeProperties[] = [
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['presence'],
        operation: ['setStatus'],
      },
    },
    options: [
      { name: 'Online', value: 'online' },
      { name: 'Idle', value: 'idle' },
      { name: 'Do Not Disturb', value: 'dnd' },
      { name: 'Invisible', value: 'invisible' },
    ],
    default: 'online',
    required: true,
  },
  {
    displayName: 'Activity Type',
    name: 'activityType',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['presence'],
        operation: ['setActivity'],
      },
    },
    options: [
      { name: 'Playing', value: 'PLAYING' },
      { name: 'Streaming', value: 'STREAMING' },
      { name: 'Listening', value: 'LISTENING' },
      { name: 'Watching', value: 'WATCHING' },
      { name: 'Competing', value: 'COMPETING' },
    ],
    default: 'PLAYING',
    required: true,
  },
  {
    displayName: 'Activity Name',
    name: 'activityName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['presence'],
        operation: ['setActivity'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Stream URL',
    name: 'streamUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['presence'],
        operation: ['setActivity'],
        activityType: ['STREAMING'],
      },
    },
    default: '',
  },
];

// Invite Fields
export const inviteFields: INodeProperties[] = [
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['invite'],
        operation: ['createInvite', 'getInvites'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Invite Code',
    name: 'inviteCode',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['invite'],
        operation: ['acceptInvite', 'deleteInvite'],
      },
    },
    default: '',
    required: true,
  },
  {
    displayName: 'Max Age',
    name: 'maxAge',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['invite'],
        operation: ['createInvite'],
      },
    },
    default: 86400,
    description: 'Time in seconds before the invite expires (0 = never)',
  },
  {
    displayName: 'Max Uses',
    name: 'maxUses',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['invite'],
        operation: ['createInvite'],
      },
    },
    default: 0,
    description: 'Maximum number of uses (0 = unlimited)',
  },
];
