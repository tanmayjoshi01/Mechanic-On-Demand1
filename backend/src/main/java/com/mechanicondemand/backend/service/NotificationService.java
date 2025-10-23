package com.mechanicondemand.backend.service;

import com.mechanicondemand.backend.model.Notification;
import com.mechanicondemand.backend.model.NotificationType;
import com.mechanicondemand.backend.model.User;
import com.mechanicondemand.backend.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void notify(User recipient, NotificationType type, String message) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .build();
        notificationRepository.save(n);
        messagingTemplate.convertAndSend("/topic/user-" + recipient.getId(), n);
    }
}
