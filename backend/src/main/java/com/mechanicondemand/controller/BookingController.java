package com.mechanicondemand.controller;

import com.mechanicondemand.dto.BookingRequest;
import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.BookingStatus;
import com.mechanicondemand.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest, Authentication authentication) {
        try {
            Booking booking = bookingService.createBooking(bookingRequest, authentication.getName());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/customer")
    public ResponseEntity<List<Booking>> getCustomerBookings(Authentication authentication) {
        try {
            List<Booking> bookings = bookingService.getCustomerBookings(authentication.getName());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/mechanic")
    public ResponseEntity<List<Booking>> getMechanicBookings(Authentication authentication) {
        try {
            List<Booking> bookings = bookingService.getMechanicBookings(authentication.getName());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{bookingId}/status/{status}")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long bookingId, @PathVariable BookingStatus status, Authentication authentication) {
        try {
            Booking booking = bookingService.updateBookingStatus(bookingId, status, authentication.getName());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long bookingId) {
        return bookingService.getBookingById(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
}