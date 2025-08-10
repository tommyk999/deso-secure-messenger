import mongoose from 'mongoose';
import cron from 'node-cron';

export async function connectDatabase(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/deso-messenger';
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('📊 Connected to MongoDB');
    
    // Setup automatic cleanup for expired messages
    setupMessageCleanup();
    
    // Setup connection event listeners
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📊 MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('📊 MongoDB reconnected');
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('⚠️  Running in development mode without database');
    // Don't throw error in development - allow server to start without DB
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

/**
 * Setup automatic cleanup for expired/disappearing messages
 */
function setupMessageCleanup(): void {
  // Run cleanup every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const { Message } = await import('../models/Message');
      
      // Delete messages that should have disappeared
      const result = await Message.deleteMany({
        disappearAt: { $lte: new Date() }
      });

      if (result.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${result.deletedCount} expired messages`);
      }
    } catch (error) {
      console.error('Message cleanup error:', error);
    }
  });

  console.log('🧹 Message cleanup scheduled');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  console.log('📊 Disconnected from MongoDB');
}
