package com.mechanicondemand.backend.controller;

import com.mechanicondemand.backend.model.*;
import com.mechanicondemand.backend.repository.BookingRepository;
import com.mechanicondemand.backend.service.NotificationService;
import com.mechanicondemand.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mechanic")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
@PreAuthorize("hasRole('MECHANIC')")
public class MechanicController {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public MechanicController(BookingRepository bookingRepository, UserRepository userRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/bookings")
    public List<Booking> myRequests(@AuthenticationPrincipal Long userId) {
        return bookingRepository.findByMechanicIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping("/bookings/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        if (!booking.getMechanic().getId().equals(userId)) return ResponseEntity.status(403).build();
        booking.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(booking);
        notificationService.notify(booking.getCustomer(), NotificationType.BOOKING_ACCEPTED, "Your booking was accepted");
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/bookings/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        if (!booking.getMechanic().getId().equals(userId)) return ResponseEntity.status(403).build();
        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);
        notificationService.notify(booking.getCustomer(), NotificationType.BOOKING_REJECTED, "Your booking was rejected");
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/bookings/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        if (!booking.getMechanic().getId().equals(userId)) return ResponseEntity.status(403).build();
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        notificationService.notify(booking.getCustomer(), NotificationType.BOOKING_COMPLETED, "Your service has been completed");
        return ResponseEntity.ok(booking);
    }
}
