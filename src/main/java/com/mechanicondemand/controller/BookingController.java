package com.mechanicondemand.controller;

import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/mechanic/bookings")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        try {
            Long mechanicId = getCurrentUserId(authentication);
            List<Booking> bookings = bookingService.getMechanicBookings(mechanicId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingBookings(Authentication authentication) {
        try {
            Long mechanicId = getCurrentUserId(authentication);
            List<Booking> bookings = bookingService.getPendingBookingsForMechanic(mechanicId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable Long bookingId, Authentication authentication) {
        try {
            Long mechanicId = getCurrentUserId(authentication);
            Booking booking = bookingService.acceptBooking(mechanicId, bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long bookingId, Authentication authentication) {
        try {
            Long mechanicId = getCurrentUserId(authentication);
            Booking booking = bookingService.rejectBooking(mechanicId, bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Long bookingId, Authentication authentication) {
        try {
            Long mechanicId = getCurrentUserId(authentication);
            Booking booking = bookingService.completeBooking(mechanicId, bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable Long bookingId, Authentication authentication) {
        try {
            Booking booking = bookingService.getBookingById(bookingId);
            Long mechanicId = getCurrentUserId(authentication);
            
            if (!booking.getMechanic().getId().equals(mechanicId)) {
                return ResponseEntity.badRequest().body("Error: Unauthorized access to booking");
            }
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    private Long getCurrentUserId(Authentication authentication) {
        return ((com.mechanicondemand.entity.User) authentication.getPrincipal()).getId();
    }
}