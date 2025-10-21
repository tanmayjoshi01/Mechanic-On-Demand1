package com.mechanicOnDemand.service;

import com.mechanicOnDemand.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotificationToUser(String username, Notification notification) {
        Map<String, Object> message = new HashMap<>();
        message.put("id", notification.getId());
        message.put("title", notification.getTitle());
        message.put("message", notification.getMessage());
        message.put("type", notification.getType().toString());
        message.put("createdAt", notification.getCreatedAt());
        message.put("isRead", notification.getIsRead());
        
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", message);
    }

    public void sendBookingUpdate(String username, String bookingId, String status, String message) {
        Map<String, Object> update = new HashMap<>();
        update.put("bookingId", bookingId);
        update.put("status", status);
        update.put("message", message);
        update.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSendToUser(username, "/queue/booking-updates", update);
    }

    public void broadcastSystemMessage(String message) {
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("message", message);
        systemMessage.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/system", systemMessage);
    }
}