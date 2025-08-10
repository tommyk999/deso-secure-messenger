// Shared types for DeSo Secure Messenger

export interface DesoUser {
  publicKey: string;
  username: string;
  profilePic?: string;
  verified: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  encryptedContent: string; // Base64 encoded encrypted content
  iv: string; // Base64 encoded initialization vector
  timestamp: Date;
  ephemeralKeyId?: string; // For perfect forward secrecy
  disappearAt?: Date; // For self-destructing messages
  messageType: 'text' | 'image' | 'file';
  delivered: boolean;
  read: boolean;
}

export interface EncryptedMessage {
  content: string;
  iv: string;
  keyId: string;
}

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export interface EphemeralKey {
  id: string;
  publicKey: string; // Base64 encoded
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

export interface Conversation {
  id: string;
  participants: string[]; // User public keys
  lastMessage?: Message;
  unreadCount: number;
  encryptionKeyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecuritySettings {
  enableDisappearingMessages: boolean;
  defaultDisappearTime: number; // seconds
  enableReadReceipts: boolean;
  enableTypingIndicators: boolean;
  requireIdentityVerification: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'read_receipt' | 'user_online' | 'user_offline';
  payload: any;
  timestamp: Date;
}
