package com.mechanicondemand.controller;

import com.mechanicondemand.entity.Notification;
import com.mechanicondemand.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private NotificationService notificationService;
    
    @MessageMapping("/notification")
    @SendTo("/topic/notifications")
    public Notification sendNotification(Notification notification) {
        // Save notification to database
        notificationService.createNotification(
                notification.getUser(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getBooking()
        );
        
        // Send to specific user
        messagingTemplate.convertAndSendToUser(
                notification.getUser().getUsername(),
                "/queue/notifications",
                notification
        );
        
        return notification;
    }
}