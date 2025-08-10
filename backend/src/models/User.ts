import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  publicKey: string;
  username: string;
  profilePic?: string;
  verified: boolean;
  encryptionPublicKey: string; // RSA public key for encryption
  ephemeralKeys: Array<{
    id: string;
    publicKey: string;
    createdAt: Date;
    expiresAt: Date;
    used: boolean;
  }>;
  securitySettings: {
    enableDisappearingMessages: boolean;
    defaultDisappearTime: number;
    enableReadReceipts: boolean;
    enableTypingIndicators: boolean;
    requireIdentityVerification: boolean;
  };
  lastSeen: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  profilePic: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  encryptionPublicKey: {
    type: String,
    required: true,
  },
  ephemeralKeys: [{
    id: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  }],
  securitySettings: {
    enableDisappearingMessages: {
      type: Boolean,
      default: false,
    },
    defaultDisappearTime: {
      type: Number,
      default: 86400, // 24 hours in seconds
    },
    enableReadReceipts: {
      type: Boolean,
      default: true,
    },
    enableTypingIndicators: {
      type: Boolean,
      default: true,
    },
    requireIdentityVerification: {
      type: Boolean,
      default: true,
    },
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for performance
UserSchema.index({ username: 1 });
UserSchema.index({ lastSeen: 1 });
UserSchema.index({ 'ephemeralKeys.id': 1 });
UserSchema.index({ 'ephemeralKeys.expiresAt': 1 });

// Methods
UserSchema.methods.generateEphemeralKey = function() {
  const ephemeralKey = {
    id: new mongoose.Types.ObjectId().toString(),
    publicKey: '', // Will be set by client
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    used: false,
  };
  
  this.ephemeralKeys.push(ephemeralKey);
  return ephemeralKey;
};

UserSchema.methods.cleanupExpiredKeys = function() {
  const now = new Date();
  this.ephemeralKeys = this.ephemeralKeys.filter(
    (key: any) => key.expiresAt > now
  );
};

UserSchema.methods.updateOnlineStatus = function(isOnline: boolean) {
  this.isOnline = isOnline;
  this.lastSeen = new Date();
};

// Pre-save middleware
UserSchema.pre('save', function(next) {
  // Clean up expired ephemeral keys before saving
  this.cleanupExpiredKeys();
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
