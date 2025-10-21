package com.mechanicondemand.controller;

import com.mechanicondemand.dto.BookingRequest;
import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.service.BookingService;
import com.mechanicondemand.service.MechanicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private MechanicService mechanicService;
    
    @PostMapping("/book")
    public ResponseEntity<?> bookMechanic(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        try {
            Long customerId = getCurrentUserId(authentication);
            Booking booking = bookingService.createBooking(customerId, request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        try {
            Long customerId = getCurrentUserId(authentication);
            List<Booking> bookings = bookingService.getCustomerBookings(customerId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable Long bookingId, Authentication authentication) {
        try {
            Booking booking = bookingService.getBookingById(bookingId);
            Long customerId = getCurrentUserId(authentication);
            
            if (!booking.getCustomer().getId().equals(customerId)) {
                return ResponseEntity.badRequest().body("Error: Unauthorized access to booking");
            }
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/mechanics/search/city/{city}")
    public ResponseEntity<?> searchMechanicsByCity(@PathVariable String city) {
        try {
            List<Mechanic> mechanics = mechanicService.searchMechanicsByCity(city);
            return ResponseEntity.ok(mechanics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/mechanics/search/pincode/{pincode}")
    public ResponseEntity<?> searchMechanicsByPincode(@PathVariable String pincode) {
        try {
            List<Mechanic> mechanics = mechanicService.searchMechanicsByPincode(pincode);
            return ResponseEntity.ok(mechanics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/mechanics/search/skill/{skill}")
    public ResponseEntity<?> searchMechanicsBySkill(@PathVariable String skill) {
        try {
            List<Mechanic> mechanics = mechanicService.searchMechanicsBySkill(skill);
            return ResponseEntity.ok(mechanics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    private Long getCurrentUserId(Authentication authentication) {
        return ((com.mechanicondemand.entity.User) authentication.getPrincipal()).getId();
    }
}