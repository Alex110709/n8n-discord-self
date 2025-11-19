# Installation Guide

## ✅ Successfully Published!

**Package Name**: `@alex110709/n8n-nodes-discord-self`  
**Version**: 2.0.0  
**npm URL**: https://www.npmjs.com/package/@alex110709/n8n-nodes-discord-self  
**GitHub**: https://github.com/Alex110709/n8n-discord-self

---

## 📦 Installation Methods

### Method 1: n8n Community Nodes UI (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter: `@alex110709/n8n-nodes-discord-self`
5. Click **Install**
6. Restart n8n

### Method 2: Manual Installation

```bash
# Navigate to n8n custom nodes directory
cd ~/.n8n/custom

# Install the package
npm install @alex110709/n8n-nodes-discord-self

# Restart n8n
```

### Method 3: Docker

Add to your Dockerfile or docker-compose.yml:

```dockerfile
ENV N8N_CUSTOM_EXTENSIONS="@alex110709/n8n-nodes-discord-self"
```

Or install manually in the container:

```bash
docker exec -it n8n npm install -g @alex110709/n8n-nodes-discord-self
```

---

## 🚀 Quick Start

### 1. Set Up Credentials

1. In n8n, go to **Credentials** → **New**
2. Search for **Discord Self-Bot API**
3. Enter your Discord user token
4. Click **Save**

### 2. Add Node to Workflow

1. Create a new workflow
2. Click **+** to add a node
3. Search for **Discord Self-Bot** (V1) or **Discord Self-Bot V2**
4. Configure your operation

---

## 🆚 Node Versions

### Discord Self-Bot (V1)
- Simple operation-based interface
- 6 basic operations: Send, Read, Edit, Delete, React, Get User Info
- Best for: Simple messaging workflows

### Discord Self-Bot V2
- Resource-based interface with 8 resource types
- Full Discord API functionality
- Best for: Advanced automation, server management, role management

---

## 📋 Available Features

### V2 Resources:
- **Message**: Send, read, edit, delete, react, pin, search
- **User Profile**: Get profile, update status, bio, avatar, username
- **Server**: Get info, list, create, update, delete, leave
- **Channel**: Get info, list, create, update, delete
- **Role**: List, create, update, delete, assign, remove
- **Member**: Get info, list, kick, ban, unban, update nickname
- **Presence**: Set status, set activity, clear presence
- **Invite**: Create, accept, get invites, delete

---

## 🔧 Configuration Examples

### Example 1: Send a Message
```json
{
  "resource": "message",
  "operation": "send",
  "channelId": "123456789012345678",
  "content": "Hello from n8n!"
}
```

### Example 2: Update User Status
```json
{
  "resource": "userProfile",
  "operation": "updateStatus",
  "status": "dnd"
}
```

### Example 3: List Server Members
```json
{
  "resource": "member",
  "operation": "listMembers",
  "serverId": "987654321098765432",
  "limit": 100
}
```

---

## ⚠️ Important Notes

1. **Discord ToS**: Using self-bots violates Discord's Terms of Service. Your account may be banned.
2. **Token Security**: Never share your Discord token. Store it securely in n8n credentials.
3. **Rate Limits**: Discord has API rate limits. Avoid excessive requests.
4. **Permissions**: You can only interact with servers/channels you have access to.

---

## 🆘 Troubleshooting

### Package not found
Make sure you're using the scoped package name:
```bash
@alex110709/n8n-nodes-discord-self
```

### Node doesn't appear
1. Restart n8n after installation
2. Clear browser cache
3. Check n8n logs for errors

### Invalid Token Error
1. Get a fresh token from Discord
2. Make sure you copied the full token
3. Check if your Discord account is locked

---

## 📚 Resources

- **Documentation**: See `docs/` folder
- **Examples**: See `examples/` folder
- **GitHub Issues**: https://github.com/Alex110709/n8n-discord-self/issues
- **npm Package**: https://www.npmjs.com/package/@alex110709/n8n-nodes-discord-self

---

## 🔄 Updates

To update to the latest version:

```bash
# n8n UI
Settings → Community Nodes → Update

# Manual
cd ~/.n8n/custom
npm update @alex110709/n8n-nodes-discord-self
```

---

## 📊 Version History

- **v2.0.0** (Current) - Full Discord API support with 8 resource types
- **v1.0.0** - Initial release with basic messaging

---

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with details:
   - n8n version
   - Node version
   - Error message
   - Steps to reproduce

---

**Happy Automating! 🚀**
