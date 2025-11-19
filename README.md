# n8n-nodes-discord-self

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

Discord Self-Bot node for n8n - Automate Discord interactions using your user account.

> ⚠️ **WARNING**: Using self-bots violates Discord's Terms of Service. Use at your own risk. Your account may be banned.

## Installation

### In n8n (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-discord-self` in the npm Package Name field
4. Agree to the risks of using community nodes
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-discord-self
# Restart n8n
```

## Getting Started

### 1. Get Your Discord Token

1. Open Discord in your web browser
2. Press `F12` to open Developer Tools
3. Go to the **Network** tab
4. Send any message in Discord
5. Look for requests to `discord.com/api`
6. Find the `authorization` header in request headers
7. Copy the token value

> ⚠️ **NEVER share your token with anyone!**

### 2. Configure Credentials in n8n

1. Go to **Credentials** > **New**
2. Search for **Discord Self-Bot API**
3. Paste your Discord user token
4. Click **Save**

### 3. Use the Node

Add the **Discord Self-Bot** node to your workflow and select an operation:

- **Send Message** - Send messages to channels
- **Read Messages** - Retrieve messages from channels
- **React to Message** - Add emoji reactions
- **Edit Message** - Edit your own messages
- **Delete Message** - Delete your own messages
- **Get User Info** - Retrieve user information

## Features

- 📤 **Send Messages**: Post messages to any channel you have access to
- 📥 **Read Messages**: Fetch recent messages from channels
- 👍 **React**: Add emoji reactions to messages
- ✏️ **Edit**: Modify your own messages
- 🗑️ **Delete**: Remove your own messages
- 👤 **User Info**: Get detailed information about Discord users

## Documentation

- [English Documentation](./docs/README.md)
- [한국어 문서](./docs/KOREAN.md)
- [Example Workflow](./examples/workflow-example.json)

## Getting Discord IDs

Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode), then:

- **Channel ID**: Right-click channel → Copy ID
- **Message ID**: Right-click message → Copy ID
- **User ID**: Right-click user → Copy ID

## Example Workflows

### Simple Message Sender

```json
{
  "operation": "sendMessage",
  "channelId": "123456789012345678",
  "content": "Hello from n8n!"
}
```

### Auto-Reply Bot

Monitor a channel and automatically reply to messages containing specific keywords.

### Message Logger

Log all messages from specific channels to a database or spreadsheet.

## Security & Privacy

- Discord tokens are stored securely using n8n's credential system
- Never commit tokens to version control
- Tokens are encrypted at rest
- Use separate Discord accounts for automation

## Legal Disclaimer

**IMPORTANT**: Self-bots violate Discord's Terms of Service (§6.3). By using this node:

- Your Discord account may be terminated without warning
- The developers assume no responsibility for consequences
- You acknowledge using this tool at your own risk

This tool is provided for **educational purposes only**.

## Troubleshooting

### Error: Invalid Token
- Verify token was copied correctly
- Get a fresh token
- Check if account is locked

### Error: Missing Permissions
- You can only interact with channels you have access to
- You can only edit/delete your own messages

### Rate Limiting
- Discord enforces rate limits on API requests
- The node handles rate limits automatically
- Avoid excessive requests in quick succession

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
n8n-nodes-discord-self/
├── src/
│   ├── credentials/
│   │   └── DiscordSelfApi.credentials.ts
│   ├── nodes/
│   │   └── DiscordSelf/
│   │       ├── DiscordSelf.node.ts
│   │       └── discord.svg
│   └── index.ts
├── tests/
│   └── DiscordSelf.test.ts
├── docs/
│   ├── README.md
│   └── KOREAN.md
├── examples/
│   └── workflow-example.json
└── package.json
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- [GitHub Issues](https://github.com/Alex110709/n8n-discord-self/issues)
- [n8n Community Forum](https://community.n8n.io)

## License

[MIT License](LICENSE)

## Resources

- [n8n Documentation](https://docs.n8n.io)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Discord Developer Portal](https://discord.com/developers)

## Changelog

### 1.0.0 (Initial Release)
- ✨ Send messages to channels
- ✨ Read messages from channels
- ✨ React to messages with emojis
- ✨ Edit and delete messages
- ✨ Get user information
- ✨ Comprehensive error handling
- ✨ TypeScript support
- ✨ Full test coverage

---

Made with ❤️ for the n8n community
