import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import webSocketService from '../services/websocket';
import { isAuthenticated } from './auth';

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bookingUpdates, setBookingUpdates] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    // Request notification permission
    webSocketService.constructor.requestNotificationPermission();

    // Connect to WebSocket
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect();
        setConnected(true);
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setConnected(false);
      }
    };

    connectWebSocket();

    // Event listeners for WebSocket messages
    const handleNotification = (event) => {
      const notification = event.detail;
      setNotifications(prev => [notification, ...prev]);
      
      // Show toast notification
      toast.info(notification.message, {
        position: "top-right",
        autoClose: 5000,
      });
    };

    const handleBookingUpdate = (event) => {
      const update = event.detail;
      setBookingUpdates(prev => [update, ...prev]);
      
      // Show toast for booking updates
      toast.success(update.message, {
        position: "top-right",
        autoClose: 3000,
      });
    };

    const handleSystemMessage = (event) => {
      const message = event.detail;
      
      // Show toast for system messages
      toast.info(message.message, {
        position: "top-center",
        autoClose: 7000,
      });
    };

    // Add event listeners
    window.addEventListener('websocket-notification', handleNotification);
    window.addEventListener('websocket-booking-update', handleBookingUpdate);
    window.addEventListener('websocket-system-message', handleSystemMessage);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('websocket-notification', handleNotification);
      window.removeEventListener('websocket-booking-update', handleBookingUpdate);
      window.removeEventListener('websocket-system-message', handleSystemMessage);
      
      webSocketService.disconnect();
      setConnected(false);
    };
  }, []);

  return {
    connected,
    notifications,
    bookingUpdates,
    clearNotifications: () => setNotifications([]),
    clearBookingUpdates: () => setBookingUpdates([])
  };
};