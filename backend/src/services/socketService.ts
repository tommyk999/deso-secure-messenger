import { Server as SocketIOServer, Socket } from 'socket.io';

export class SocketService {
  private io: SocketIOServer;
  private socket: Socket;

  constructor(io: SocketIOServer, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  public handleConnection(): void {
    console.log(`Socket connected: ${this.socket.id}`);

    // Handle joining rooms (conversations)
    this.socket.on('join_conversation', (conversationId: string) => {
      this.socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Handle leaving rooms
    this.socket.on('leave_conversation', (conversationId: string) => {
      this.socket.leave(conversationId);
      console.log(`User left conversation: ${conversationId}`);
    });

    // Handle sending messages
    this.socket.on('send_message', (data) => {
      // TODO: Implement message validation and persistence
      console.log('Message received:', data);
      
      // Broadcast to conversation room
      this.socket.to(data.conversationId).emit('new_message', {
        ...data,
        timestamp: new Date(),
      });
    });

    // Handle typing indicators
    this.socket.on('typing_start', (data) => {
      this.socket.to(data.conversationId).emit('user_typing', {
        userId: this.socket.data.user?.publicKey,
        conversationId: data.conversationId,
      });
    });

    this.socket.on('typing_stop', (data) => {
      this.socket.to(data.conversationId).emit('user_stopped_typing', {
        userId: this.socket.data.user?.publicKey,
        conversationId: data.conversationId,
      });
    });

    // Handle user status updates
    this.socket.on('update_status', (status: 'online' | 'away' | 'busy' | 'offline') => {
      // TODO: Update user status in database
      this.socket.broadcast.emit('user_status_changed', {
        userId: this.socket.data.user?.publicKey,
        status,
      });
    });

    // Handle disconnection
    this.socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${this.socket.id}, reason: ${reason}`);
      
      // TODO: Update user status to offline
      this.socket.broadcast.emit('user_status_changed', {
        userId: this.socket.data.user?.publicKey,
        status: 'offline',
      });
    });

    // Handle errors
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Utility method to send message to specific conversation
  public sendToConversation(conversationId: string, event: string, data: any): void {
    this.io.to(conversationId).emit(event, data);
  }

  // Utility method to send message to specific user
  public sendToUser(userId: string, event: string, data: any): void {
    this.io.emit(event, data); // TODO: Implement user-specific rooms
  }
}
