// Cryptographic utilities for secure messaging

import { EncryptedMessage, KeyPair } from './types';

export class CryptoUtils {
  private static algorithm = 'AES-GCM';
  private static keyLength = 256;
  private static ivLength = 12; // 96 bits for GCM

  /**
   * Generate a new AES-256-GCM key for encryption
   */
  static async generateEncryptionKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate RSA key pair for key exchange
   */
  static async generateKeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
    };
  }

  /**
   * Encrypt a message using AES-256-GCM
   */
  static async encryptMessage(
    message: string,
    key: CryptoKey,
    keyId: string
  ): Promise<EncryptedMessage> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
    
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      data
    );

    return {
      content: this.arrayBufferToBase64(encryptedData),
      iv: this.arrayBufferToBase64(iv),
      keyId,
    };
  }

  /**
   * Decrypt a message using AES-256-GCM
   */
  static async decryptMessage(
    encryptedMessage: EncryptedMessage,
    key: CryptoKey
  ): Promise<string> {
    const encryptedData = this.base64ToArrayBuffer(encryptedMessage.content);
    const iv = this.base64ToArrayBuffer(encryptedMessage.iv);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }

  /**
   * Encrypt a key using RSA-OAEP (for key exchange)
   */
  static async encryptKey(
    key: CryptoKey,
    recipientPublicKey: CryptoKey
  ): Promise<string> {
    // Export the key to encrypt it
    const keyData = await crypto.subtle.exportKey('raw', key);
    
    const encryptedKey = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      recipientPublicKey,
      keyData
    );

    return this.arrayBufferToBase64(encryptedKey);
  }

  /**
   * Decrypt a key using RSA-OAEP (for key exchange)
   */
  static async decryptKey(
    encryptedKey: string,
    privateKey: CryptoKey
  ): Promise<CryptoKey> {
    const encryptedKeyData = this.base64ToArrayBuffer(encryptedKey);
    
    const keyData = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      encryptedKeyData
    );

    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: this.algorithm },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Export public key to base64 string
   */
  static async exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const keyData = await crypto.subtle.exportKey('spki', publicKey);
    return this.arrayBufferToBase64(keyData);
  }

  /**
   * Import public key from base64 string
   */
  static async importPublicKey(keyString: string): Promise<CryptoKey> {
    const keyData = this.base64ToArrayBuffer(keyString);
    
    return await crypto.subtle.importKey(
      'spki',
      keyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );
  }

  /**
   * Generate a cryptographically secure random ID
   */
  static generateSecureId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.arrayBufferToBase64(array);
  }

  /**
   * Hash data using SHA-256
   */
  static async hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return this.arrayBufferToBase64(hashBuffer);
  }

  /**
   * Convert ArrayBuffer to Base64
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  /**
   * Convert Base64 to ArrayBuffer
   */
  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Secure memory cleanup (best effort)
   */
  static secureCleanup(sensitiveData: any): void {
    if (typeof sensitiveData === 'string') {
      // Overwrite string content (limited effectiveness in JS)
      for (let i = 0; i < sensitiveData.length; i++) {
        sensitiveData = sensitiveData.substring(0, i) + '0' + sensitiveData.substring(i + 1);
      }
    }
    // For objects, recursively clear properties
    if (typeof sensitiveData === 'object' && sensitiveData !== null) {
      Object.keys(sensitiveData).forEach(key => {
        delete sensitiveData[key];
      });
    }
  }
}

export default CryptoUtils;
