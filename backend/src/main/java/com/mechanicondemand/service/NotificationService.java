package com.mechanicondemand.service;

import com.mechanicondemand.entity.Notification;
import com.mechanicondemand.entity.NotificationType;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.NotificationRepository;
import com.mechanicondemand.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Notification createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }
    
    public Notification createNotification(User user, String title, String message, NotificationType type, com.mechanicondemand.entity.Booking booking) {
        Notification notification = new Notification(user, title, message, type, booking);
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
    }
    
    public List<Notification> getUnreadNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
    }
    
    public Long getUnreadNotificationCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.countByUser_IdAndIsReadFalse(user.getId());
    }
    
    public Notification markAsRead(Long notificationId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to access this notification");
        }
        
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}