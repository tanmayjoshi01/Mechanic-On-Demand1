package com.mechanicondemand.controller;

import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.entity.Notification;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.BookingRepository;
import com.mechanicondemand.repository.UserRepository;
import com.mechanicondemand.service.BookingService;
import com.mechanicondemand.service.MechanicService;
import com.mechanicondemand.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MechanicService mechanicService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.count();
        long totalMechanics = mechanicService.getAllMechanics().size();
        
        // Booking statistics
        List<Booking> allBookings = bookingService.getAllBookings();
        long totalBookings = allBookings.size();
        long pendingBookings = allBookings.stream()
                .filter(b -> b.getStatus().name().equals("PENDING"))
                .count();
        long completedBookings = allBookings.stream()
                .filter(b -> b.getStatus().name().equals("COMPLETED"))
                .count();
        
        // Notification statistics
        List<Notification> allNotifications = notificationService.getAllNotifications();
        long totalNotifications = allNotifications.size();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalMechanics", totalMechanics);
        stats.put("totalBookings", totalBookings);
        stats.put("pendingBookings", pendingBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("totalNotifications", totalNotifications);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/mechanics")
    public ResponseEntity<List<Mechanic>> getAllMechanics() {
        List<Mechanic> mechanics = mechanicService.getAllMechanics();
        return ResponseEntity.ok(mechanics);
    }
    
    @GetMapping("/mechanics/unverified")
    public ResponseEntity<List<Mechanic>> getUnverifiedMechanics() {
        List<Mechanic> mechanics = mechanicService.getUnverifiedMechanics();
        return ResponseEntity.ok(mechanics);
    }
    
    @PutMapping("/mechanics/{mechanicId}/verify")
    public ResponseEntity<?> verifyMechanic(@PathVariable Long mechanicId) {
        try {
            Mechanic mechanic = mechanicService.verifyMechanic(mechanicId);
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userRepository.deleteById(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}