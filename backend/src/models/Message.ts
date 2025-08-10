import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  encryptedContent: string; // Base64 encoded encrypted content
  iv: string; // Base64 encoded initialization vector
  ephemeralKeyId?: string; // For perfect forward secrecy
  disappearAt?: Date; // For self-destructing messages
  messageType: 'text' | 'image' | 'file';
  metadata?: {
    filename?: string;
    fileSize?: number;
    mimeType?: string;
  };
  delivered: boolean;
  deliveredAt?: Date;
  read: boolean;
  readAt?: Date;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: String,
    required: true,
    index: true,
  },
  recipientId: {
    type: String,
    required: true,
    index: true,
  },
  encryptedContent: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  ephemeralKeyId: {
    type: String,
    index: true,
  },
  disappearAt: {
    type: Date,
    index: true, // For efficient cleanup
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  },
  metadata: {
    filename: String,
    fileSize: Number,
    mimeType: String,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
MessageSchema.index({ conversationId: 1, timestamp: -1 });
MessageSchema.index({ senderId: 1, timestamp: -1 });
MessageSchema.index({ recipientId: 1, delivered: 1 });
MessageSchema.index({ disappearAt: 1 }, { sparse: true });

// Methods
MessageSchema.methods.markAsDelivered = function() {
  this.delivered = true;
  this.deliveredAt = new Date();
};

MessageSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  // Also mark as delivered if not already
  if (!this.delivered) {
    this.markAsDelivered();
  }
};

MessageSchema.methods.shouldDisappear = function() {
  return this.disappearAt && this.disappearAt <= new Date();
};

// Pre-save middleware
MessageSchema.pre('save', function(next) {
  // Generate unique ID if not present
  if (!this.id) {
    this.id = new mongoose.Types.ObjectId().toString();
  }
  next();
});

// Static methods
MessageSchema.statics.findByConversation = function(
  conversationId: string,
  limit: number = 50,
  before?: Date
) {
  const query: any = { conversationId };
  if (before) {
    query.timestamp = { $lt: before };
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
};

MessageSchema.statics.findUndelivered = function(recipientId: string) {
  return this.find({
    recipientId,
    delivered: false,
  }).sort({ timestamp: 1 }).exec();
};

MessageSchema.statics.markConversationAsRead = function(
  conversationId: string,
  userId: string
) {
  return this.updateMany(
    {
      conversationId,
      recipientId: userId,
      read: false,
    },
    {
      $set: {
        read: true,
        readAt: new Date(),
      },
    }
  );
};

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
