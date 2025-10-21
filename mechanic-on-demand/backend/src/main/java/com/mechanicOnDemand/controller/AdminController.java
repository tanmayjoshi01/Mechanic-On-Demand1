package com.mechanicOnDemand.controller;

import com.mechanicOnDemand.dto.MessageResponse;
import com.mechanicOnDemand.model.*;
import com.mechanicOnDemand.repository.UserRepository;
import com.mechanicOnDemand.service.BookingService;
import com.mechanicOnDemand.service.MechanicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MechanicService mechanicService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        List<User> customers = userRepository.findByRole(Role.CUSTOMER);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/users/mechanics")
    public ResponseEntity<List<User>> getAllMechanicUsers() {
        List<User> mechanics = userRepository.findByRole(Role.MECHANIC);
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/mechanics")
    public ResponseEntity<List<Mechanic>> getAllMechanics() {
        List<Mechanic> mechanics = mechanicService.getAllMechanics();
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/mechanics/unverified")
    public ResponseEntity<List<Mechanic>> getUnverifiedMechanics() {
        List<Mechanic> mechanics = mechanicService.getAllMechanics()
                .stream()
                .filter(m -> !m.getIsVerified())
                .toList();
        return ResponseEntity.ok(mechanics);
    }

    @PutMapping("/mechanics/{id}/verify")
    public ResponseEntity<?> verifyMechanic(@PathVariable Long id) {
        try {
            mechanicService.verifyMechanic(id);
            return ResponseEntity.ok(new MessageResponse("Mechanic verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCustomers", userRepository.findByRole(Role.CUSTOMER).size());
        stats.put("totalMechanics", userRepository.findByRole(Role.MECHANIC).size());
        stats.put("activeUsers", userRepository.findByIsActive(true).size());
        
        // Mechanic statistics
        List<Mechanic> allMechanics = mechanicService.getAllMechanics();
        stats.put("verifiedMechanics", allMechanics.stream().filter(Mechanic::getIsVerified).count());
        stats.put("availableMechanics", allMechanics.stream().filter(Mechanic::getIsAvailable).count());
        
        // Booking statistics
        stats.put("totalBookings", bookingService.getAllBookings().size());
        stats.put("pendingBookings", bookingService.getBookingCountByStatus(BookingStatus.PENDING));
        stats.put("acceptedBookings", bookingService.getBookingCountByStatus(BookingStatus.ACCEPTED));
        stats.put("completedBookings", bookingService.getBookingCountByStatus(BookingStatus.COMPLETED));
        stats.put("cancelledBookings", bookingService.getBookingCountByStatus(BookingStatus.CANCELLED));
        
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setIsActive(true);
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("User activated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setIsActive(false);
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("User deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}