package com.mechanicOnDemand.controller;

import com.mechanicOnDemand.dto.BookingRequest;
import com.mechanicOnDemand.dto.MessageResponse;
import com.mechanicOnDemand.model.Booking;
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
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {
    @Autowired
    private MechanicService mechanicService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/mechanics")
    public ResponseEntity<List<Mechanic>> getAllMechanics() {
        List<Mechanic> mechanics = mechanicService.getAvailableMechanics();
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/mechanics/city/{city}")
    public ResponseEntity<List<Mechanic>> getMechanicsByCity(@PathVariable String city) {
        List<Mechanic> mechanics = mechanicService.getMechanicsByCity(city);
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/mechanics/pincode/{pincode}")
    public ResponseEntity<List<Mechanic>> getMechanicsByPincode(@PathVariable String pincode) {
        List<Mechanic> mechanics = mechanicService.getMechanicsByPincode(pincode);
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/mechanics/search")
    public ResponseEntity<List<Mechanic>> searchMechanics(@RequestParam String skill) {
        List<Mechanic> mechanics = mechanicService.searchMechanicsBySkill(skill);
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/mechanics/{id}")
    public ResponseEntity<Mechanic> getMechanicById(@PathVariable Long id) {
        return mechanicService.getMechanicById(id)
                .map(mechanic -> ResponseEntity.ok().body(mechanic))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest, 
                                         Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Booking booking = bookingService.createBooking(user.getId(), bookingRequest);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Booking> bookings = bookingService.getBookingsByCustomer(user.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return bookingService.getBookingById(id)
                .filter(booking -> booking.getCustomer().getId().equals(user.getId()))
                .map(booking -> ResponseEntity.ok().body(booking))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Booking booking = bookingService.getBookingById(id)
                    .filter(b -> b.getCustomer().getId().equals(user.getId()))
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            bookingService.cancelBooking(id);
            return ResponseEntity.ok(new MessageResponse("Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}