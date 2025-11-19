# n8n-nodes-discord-self

Discord Self-Bot node for n8n - Automate Discord interactions using your user account.

> ⚠️ **WARNING**: Using self-bots violates Discord's Terms of Service. Use at your own risk. Your account may be banned.

## Features

This package provides a custom n8n node that allows you to:

- 📤 Send messages to channels
- 📥 Read messages from channels
- 👍 React to messages with emojis
- ✏️ Edit your own messages
- 🗑️ Delete your own messages
- 👤 Get user information

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Click **Install** and enter: `n8n-nodes-discord-self`
3. Click **Install** and agree to the risks

### Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-discord-self
```

Restart n8n after installation.

## Prerequisites

- n8n version 0.199.0 or higher
- Discord user account token

## Getting Your Discord Token

1. Open Discord in your web browser
2. Press `F12` to open Developer Tools
3. Go to the **Network** tab
4. Send any message in Discord
5. Look for requests to `discord.com/api`
6. In the request headers, find `authorization` header
7. Copy the token value (it's your user token)

> ⚠️ **NEVER share your token with anyone!**

## Configuration

### Setting up Credentials

1. In n8n, go to **Credentials** > **New**
2. Search for **Discord Self-Bot API**
3. Enter your Discord user token
4. Click **Save**

## Operations

### Send Message

Send a message to a Discord channel.

**Parameters:**
- `Channel ID` (required): The ID of the channel
- `Message Content` (required): The text content to send

**Example:**
```json
{
  "channelId": "123456789012345678",
  "content": "Hello from n8n!"
}
```

### Read Messages

Retrieve recent messages from a channel.

**Parameters:**
- `Channel ID` (required): The ID of the channel
- `Limit` (optional): Number of messages to retrieve (1-100, default: 10)

**Output:**
```json
{
  "messageId": "987654321098765432",
  "channelId": "123456789012345678",
  "content": "Message text",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": "111111111111111111",
    "username": "Username",
    "discriminator": "1234"
  }
}
```

### React to Message

Add an emoji reaction to a message.

**Parameters:**
- `Channel ID` (required): The ID of the channel
- `Message ID` (required): The ID of the message
- `Emoji` (required): The emoji to react with (e.g., 👍, ❤️, or custom emoji)

### Edit Message

Edit one of your own messages.

**Parameters:**
- `Channel ID` (required): The ID of the channel
- `Message ID` (required): The ID of the message to edit
- `New Content` (required): The new text content

### Delete Message

Delete one of your own messages.

**Parameters:**
- `Channel ID` (required): The ID of the channel
- `Message ID` (required): The ID of the message to delete

### Get User Info

Retrieve information about a Discord user.

**Parameters:**
- `User ID` (required): The ID of the user

**Output:**
```json
{
  "id": "111111111111111111",
  "username": "Username",
  "discriminator": "1234",
  "bot": false,
  "avatar": "hash",
  "avatarURL": "https://cdn.discordapp.com/avatars/...",
  "createdAt": "2020-01-01T00:00:00.000Z"
}
```

## Getting Discord IDs

### Channel ID
1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on a channel
3. Click **Copy ID**

### Message ID
1. Enable Developer Mode
2. Right-click on a message
3. Click **Copy ID**

### User ID
1. Enable Developer Mode
2. Right-click on a user
3. Click **Copy ID**

## Example Workflows

### Auto-Reply Bot

Create a workflow that monitors a channel and replies to messages containing specific keywords.

### Message Logger

Log all messages from specific channels to a database or spreadsheet.

### Scheduled Announcements

Send automated messages to channels on a schedule.

## Troubleshooting

### Error: Invalid Token
- Make sure you copied the token correctly
- Try obtaining a fresh token
- Ensure your Discord account is not locked

### Error: Missing Permissions
- You can only interact with channels you have access to
- You can only edit/delete your own messages

### Rate Limiting
- Discord has rate limits on API requests
- The node will automatically handle rate limits
- Avoid sending too many requests in quick succession

## Security

- **NEVER** commit your Discord token to version control
- Store tokens securely using n8n's credential system
- Regularly rotate your token if compromised

## Legal Disclaimer

This tool is provided for educational purposes only. Using self-bots violates Discord's Terms of Service (§6.3). By using this node, you acknowledge that:

- Your Discord account may be terminated
- The developers are not responsible for any consequences
- You use this tool at your own risk

## Support

- Report issues: [GitHub Issues](https://github.com/Alex110709/n8n-discord-self/issues)
- n8n Community: [community.n8n.io](https://community.n8n.io)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### 1.0.0
- Initial release
- Basic messaging operations
- User info retrieval
- Message reactions
