# DeSo Secure Messenger

**🔒 PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED**

**Copyright © 2025 Tommyk999. This is proprietary and confidential software.**

A privacy-first, secure messaging application built on the DeSo blockchain platform.

⚠️ **IMPORTANT NOTICE**: This software is proprietary and protected by copyright law. Unauthorized use, reproduction, or distribution is prohibited. See [LICENSE](./LICENSE) for details.

## 🔒 Security Features

- **End-to-End Encryption**: All messages encrypted using AES-256-GCM
- **Perfect Forward Secrecy**: New encryption keys for each session
- **Zero-Knowledge Architecture**: Server never sees message content
- **DeSo Identity Integration**: Blockchain-based identity verification
- **Message Disappearing**: Optional self-destructing messages
- **Metadata Protection**: Minimal metadata collection and storage

## 🏗️ Architecture

```
├── frontend/          # React app with TypeScript
├── backend/           # Node.js API server
├── shared/            # Shared utilities and types
└── docs/              # Documentation
```

## 🚀 Quick Start

1. Install dependencies: `npm install`
2. Start backend: `cd backend && npm start`
3. Start frontend: `cd frontend && npm start`

## 🛡️ Security Considerations

- All cryptographic operations use Web Crypto API
- Private keys never leave the client
- Messages are encrypted before transmission
- Perfect forward secrecy through ephemeral keys
- Regular security audits and updates

## 📋 Features

- [x] End-to-end encrypted messaging
- [x] DeSo blockchain integration
- [x] Real-time message delivery
- [x] Message disappearing/self-destruct
- [x] Identity verification
- [ ] Group messaging (coming soon)
- [ ] File sharing (coming soon)
- [ ] Voice messages (coming soon)
