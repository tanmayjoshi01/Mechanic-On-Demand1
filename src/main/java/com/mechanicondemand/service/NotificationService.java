package com.mechanicondemand.service;

import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.Notification;
import com.mechanicondemand.entity.NotificationType;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.NotificationRepository;
import com.mechanicondemand.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Notification createNotification(Long userId, String title, String message, NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }
    
    public Notification createNotification(Long userId, String title, String message, NotificationType type, Booking booking) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = new Notification(user, title, message, type, booking);
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findUnreadNotificationsByUserId(userId);
    }
    
    public Long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countUnreadNotificationsByUserId(userId);
    }
    
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findUnreadNotificationsByUserId(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
}