# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-08
**Commit:** 3579840
**Branch:** main

## OVERVIEW

n8n community node package for Discord self-bot automation using `discord.js-selfbot-v13`. Provides action node (Discord User) + trigger node (Discord User Trigger) for workflow automation.

## STRUCTURE

```
n8n-discord-self/
├── src/
│   ├── credentials/          # DiscordSelfApi token credential
│   ├── nodes/
│   │   ├── DiscordSelf/      # Shared operations.ts, descriptions.ts + legacy nodes
│   │   ├── DiscordUser/      # Main action node (443 lines)
│   │   └── DiscordSelfTrigger/  # Event trigger node (660 lines)
│   └── index.ts              # Barrel exports
├── tests/                    # Jest tests (*.test.ts)
├── dist/                     # Build output (published to npm)
└── docs/                     # EN/KR documentation
```

## WHERE TO LOOK

| Task                | Location                                                  | Notes                   |
| ------------------- | --------------------------------------------------------- | ----------------------- |
| Add new operation   | `src/nodes/DiscordSelf/operations.ts` + `descriptions.ts` | Add to both files       |
| Modify action logic | `src/nodes/DiscordUser/DiscordUser.node.ts`               | Main action node        |
| Add trigger event   | `src/nodes/DiscordSelfTrigger/DiscordSelfTrigger.node.ts` | Event handlers          |
| Credential config   | `src/credentials/DiscordSelfApi.credentials.ts`           | Token auth only         |
| Add tests           | `tests/[NodeName].test.ts`                                | Jest, mocked discord.js |

## NODE ARCHITECTURE

**Registered Nodes** (package.json):

1. `DiscordUser` - Full-featured action node (8 resources, 40+ operations)
2. `DiscordSelfTrigger` - Event trigger node (11 event types)

**Legacy/Unregistered** (exist but NOT in package.json):

- `DiscordSelf.node.ts` - Basic operations (legacy)
- `DiscordSelfV2.node.ts` - Resource-based (superseded by DiscordUser)

**Resource Model** (DiscordUser):

- Message: send, sendDM, read, edit, delete, react, pin, unpin, search
- User Profile: getProfile, updateStatus, updateBio, updateAvatar, updateUsername
- Server: getInfo, listServers, createServer, updateServer, deleteServer, leaveServer
- Channel: getInfo, listChannels, createChannel, deleteChannel
- Role: listRoles, createRole, assignRole, removeRole
- Member: getInfo, listMembers, kickMember, banMember
- Presence: setStatus, setActivity
- Invite: createInvite, acceptInvite

**Trigger Events**:

- messageCreate, dmReceived, messageUpdate, messageDelete
- messageReactionAdd, messageReactionRemove
- guildMemberAdd, guildMemberRemove, guildMemberUpdate
- presenceUpdate, typingStart

## CONVENTIONS

| Area            | Convention                               |
| --------------- | ---------------------------------------- |
| Quotes          | Single quotes only                       |
| Line width      | 100 chars max                            |
| Trailing commas | All (including functions)                |
| Semicolons      | Required                                 |
| Unused params   | Prefix with `_`                          |
| Test files      | `tests/[NodeName].test.ts`               |
| Node naming     | PascalCase file, camelCase internal name |

## ANTI-PATTERNS

| Pattern                            | Reason                                                            |
| ---------------------------------- | ----------------------------------------------------------------- |
| Direct import from legacy nodes    | Use DiscordUser/DiscordSelfTrigger only                           |
| Modifying package.json n8n section | Breaks n8n discovery                                              |
| Console.log in production          | Currently present in trigger - debug only                         |
| `as any` type casting              | Allowed with warning (`@typescript-eslint/no-explicit-any: warn`) |

## COMMANDS

```bash
# Development
npm run dev          # Watch mode
npm run typecheck    # Type check only

# Build & Quality
npm run build        # tsc + copy SVG/PNG to dist
npm run lint         # ESLint
npm run lintfix      # ESLint with auto-fix
npm run format       # Prettier

# Testing
npm test             # Jest (9 tests)

# Publishing (manual)
npm login && npm publish  # prepublishOnly runs build+lint
```

## NOTES

- **Self-bot Warning**: Violates Discord ToS. Account may be banned.
- **No CI/CD**: Manual build/publish process only.
- **Intents**: Trigger uses `intents: 32767` (all intents) for self-bot compatibility.
- **Client lifecycle**: Action nodes create/destroy client per execution. Trigger maintains persistent connection.
- **n8n API Version**: Uses v1 (`n8nNodesApiVersion: 1`).
- **Node.js**: Requires >= 18.10.

## DEPENDENCIES

| Package                  | Purpose                            |
| ------------------------ | ---------------------------------- |
| `discord.js-selfbot-v13` | Self-bot Discord API (user tokens) |
| `n8n-workflow`           | n8n node/credential interfaces     |
| `copyfiles`              | Build-time SVG/PNG copying         |
