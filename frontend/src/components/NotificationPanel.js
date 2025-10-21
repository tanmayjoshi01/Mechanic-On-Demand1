import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications/unread/count');
      setUnreadCount(response.data);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(notifications.map(notification => ({
        ...notification,
        isRead: true
      })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading notifications...</div>;
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Notifications</h5>
        <div>
          {unreadCount > 0 && (
            <Badge bg="danger" className="me-2">
              {unreadCount} unread
            </Badge>
          )}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body className="p-0">
        {notifications.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No notifications yet</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((notification) => (
              <ListGroup.Item
                key={notification.id}
                className={`d-flex justify-content-between align-items-start ${
                  !notification.isRead ? 'bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    {notification.title}
                    {!notification.isRead && (
                      <Badge bg="primary" className="ms-2">New</Badge>
                    )}
                  </div>
                  <p className="mb-1">{notification.message}</p>
                  <small className="text-muted">
                    {formatDate(notification.createdAt)}
                  </small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default NotificationPanel;