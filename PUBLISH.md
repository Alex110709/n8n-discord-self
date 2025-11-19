# Publishing Guide

## Prerequisites
1. Create an npm account at https://www.npmjs.com/signup
2. Enable 2FA for security (recommended)

## Steps to Publish

### 1. Login to npm
```bash
npm login
```

Enter your credentials when prompted.

### 2. Publish the package
```bash
npm publish
```

### 3. Verify publication
```bash
npm view n8n-nodes-discord-self
```

## Package Information
- **Name**: n8n-nodes-discord-self
- **Version**: 1.0.0
- **Package Size**: ~9.3 KB
- **Unpacked Size**: ~38.5 KB
- **Repository**: https://github.com/Alex110709/n8n-discord-self

## Installation for Users
After publishing, users can install via:

### n8n Community Nodes UI
1. Settings > Community Nodes
2. Install > Enter: n8n-nodes-discord-self
3. Install

### Manual Installation
```bash
cd ~/.n8n/custom
npm install n8n-nodes-discord-self
```

## Updating the Package

1. Update version in package.json:
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

2. Push changes:
```bash
git push && git push --tags
```

3. Publish:
```bash
npm publish
```

## Troubleshooting

### Error: Package name already exists
The name is taken. Choose a different name in package.json.

### Error: Need auth
Run `npm login` first.

### Error: 403 Forbidden
You don't have permission. Make sure you're logged in as the package owner.

## Support
- Report issues: https://github.com/Alex110709/n8n-discord-self/issues
- npm package: https://www.npmjs.com/package/n8n-nodes-discord-self
