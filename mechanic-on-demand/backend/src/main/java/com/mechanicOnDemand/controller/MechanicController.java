package com.mechanicOnDemand.controller;

import com.mechanicOnDemand.dto.MechanicProfileRequest;
import com.mechanicOnDemand.dto.MessageResponse;
import com.mechanicOnDemand.model.Booking;
import com.mechanicOnDemand.model.BookingStatus;
import com.mechanicOnDemand.model.Mechanic;
import com.mechanicOnDemand.model.User;
import com.mechanicOnDemand.service.BookingService;
import com.mechanicOnDemand.service.MechanicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/mechanic")
@PreAuthorize("hasRole('MECHANIC')")
public class MechanicController {
    @Autowired
    private MechanicService mechanicService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/profile")
    public ResponseEntity<Mechanic> getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return mechanicService.getMechanicByUserId(user.getId())
                .map(mechanic -> ResponseEntity.ok().body(mechanic))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(@Valid @RequestBody MechanicProfileRequest profileRequest,
                                         Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Mechanic mechanic = mechanicService.createMechanicProfile(user.getId(), profileRequest);
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody MechanicProfileRequest profileRequest,
                                         Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Mechanic mechanic = mechanicService.getMechanicByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
            
            Mechanic updatedMechanic = mechanicService.updateMechanicProfile(mechanic.getId(), profileRequest);
            return ResponseEntity.ok(updatedMechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Mechanic mechanic = mechanicService.getMechanicByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
        
        List<Booking> bookings = bookingService.getBookingsByMechanic(mechanic.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Mechanic mechanic = mechanicService.getMechanicByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
        
        return bookingService.getBookingById(id)
                .filter(booking -> booking.getMechanic().getId().equals(mechanic.getId()))
                .map(booking -> ResponseEntity.ok().body(booking))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/bookings/{id}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable Long id, 
                                         @RequestParam(required = false) String notes,
                                         Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Mechanic mechanic = mechanicService.getMechanicByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
            
            Booking booking = bookingService.getBookingById(id)
                    .filter(b -> b.getMechanic().getId().equals(mechanic.getId()))
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            Booking updatedBooking = bookingService.updateBookingStatus(id, BookingStatus.ACCEPTED, notes);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/bookings/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long id, 
                                         @RequestParam(required = false) String notes,
                                         Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Mechanic mechanic = mechanicService.getMechanicByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
            
            Booking booking = bookingService.getBookingById(id)
                    .filter(b -> b.getMechanic().getId().equals(mechanic.getId()))
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            Booking updatedBooking = bookingService.updateBookingStatus(id, BookingStatus.REJECTED, notes);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable Long id, 
                                           @RequestParam(required = false) String notes,
                                           Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Mechanic mechanic = mechanicService.getMechanicByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
            
            Booking booking = bookingService.getBookingById(id)
                    .filter(b -> b.getMechanic().getId().equals(mechanic.getId()))
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            Booking updatedBooking = bookingService.updateBookingStatus(id, BookingStatus.COMPLETED, notes);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/availability")
    public ResponseEntity<?> updateAvailability(@RequestParam Boolean available, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Mechanic mechanic = mechanicService.getMechanicByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
            
            MechanicProfileRequest request = new MechanicProfileRequest();
            request.setIsAvailable(available);
            
            Mechanic updatedMechanic = mechanicService.updateMechanicProfile(mechanic.getId(), request);
            return ResponseEntity.ok(updatedMechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}