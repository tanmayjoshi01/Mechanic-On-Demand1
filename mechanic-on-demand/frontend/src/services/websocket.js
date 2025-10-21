import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { getUser } from '../utils/auth';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const user = getUser();
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);

      // Disable debug logging
      this.stompClient.debug = () => {};

      this.stompClient.connect(
        {},
        (frame) => {
          console.log('Connected to WebSocket:', frame);
          this.connected = true;
          this.subscribeToUserNotifications();
          this.subscribeToBookingUpdates();
          resolve(frame);
        },
        (error) => {
          console.error('WebSocket connection error:', error);
          this.connected = false;
          reject(error);
        }
      );
    });
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
        this.connected = false;
      });
    }
  }

  subscribeToUserNotifications() {
    const user = getUser();
    if (!user || !this.stompClient || !this.connected) return;

    const subscription = this.stompClient.subscribe(
      `/user/${user.username}/queue/notifications`,
      (message) => {
        const notification = JSON.parse(message.body);
        this.handleNotification(notification);
      }
    );

    this.subscriptions.set('notifications', subscription);
  }

  subscribeToBookingUpdates() {
    const user = getUser();
    if (!user || !this.stompClient || !this.connected) return;

    const subscription = this.stompClient.subscribe(
      `/user/${user.username}/queue/booking-updates`,
      (message) => {
        const update = JSON.parse(message.body);
        this.handleBookingUpdate(update);
      }
    );

    this.subscriptions.set('booking-updates', subscription);
  }

  subscribeToSystemMessages() {
    if (!this.stompClient || !this.connected) return;

    const subscription = this.stompClient.subscribe(
      '/topic/system',
      (message) => {
        const systemMessage = JSON.parse(message.body);
        this.handleSystemMessage(systemMessage);
      }
    );

    this.subscriptions.set('system', subscription);
  }

  handleNotification(notification) {
    // Dispatch custom event for notification
    const event = new CustomEvent('websocket-notification', {
      detail: notification
    });
    window.dispatchEvent(event);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  }

  handleBookingUpdate(update) {
    // Dispatch custom event for booking update
    const event = new CustomEvent('websocket-booking-update', {
      detail: update
    });
    window.dispatchEvent(event);
  }

  handleSystemMessage(message) {
    // Dispatch custom event for system message
    const event = new CustomEvent('websocket-system-message', {
      detail: message
    });
    window.dispatchEvent(event);
  }

  isConnected() {
    return this.connected;
  }

  // Request notification permission
  static requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;