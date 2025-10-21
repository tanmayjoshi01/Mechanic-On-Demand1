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
        return notification;
    }
    
    public void sendNotificationToUser(Long userId, Notification notification) {
        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/notifications", notification);
    }
}