package com.mechanicondemand.controller;

import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.BookingRepository;
import com.mechanicondemand.repository.UserRepository;
import com.mechanicondemand.service.MechanicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MechanicService mechanicService;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/mechanics")
    public ResponseEntity<?> getAllMechanics() {
        try {
            List<Mechanic> mechanics = mechanicService.getAllMechanics();
            return ResponseEntity.ok(mechanics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
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
    
    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // User statistics
            stats.put("totalUsers", userRepository.count());
            stats.put("totalMechanics", userRepository.findByRole(com.mechanicondemand.entity.Role.MECHANIC).size());
            stats.put("totalCustomers", userRepository.findByRole(com.mechanicondemand.entity.Role.CUSTOMER).size());
            
            // Booking statistics
            stats.put("totalBookings", bookingRepository.count());
            stats.put("pendingBookings", bookingRepository.countByStatus(com.mechanicondemand.entity.BookingStatus.PENDING));
            stats.put("acceptedBookings", bookingRepository.countByStatus(com.mechanicondemand.entity.BookingStatus.ACCEPTED));
            stats.put("completedBookings", bookingRepository.countByStatus(com.mechanicondemand.entity.BookingStatus.COMPLETED));
            stats.put("cancelledBookings", bookingRepository.countByStatus(com.mechanicondemand.entity.BookingStatus.CANCELLED));
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}