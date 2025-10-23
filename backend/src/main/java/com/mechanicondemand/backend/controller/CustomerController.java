package com.mechanicondemand.backend.controller;

import com.mechanicondemand.backend.dto.BookingDtos;
import com.mechanicondemand.backend.model.*;
import com.mechanicondemand.backend.repository.BookingRepository;
import com.mechanicondemand.backend.service.NotificationService;
import com.mechanicondemand.backend.repository.MechanicProfileRepository;
import com.mechanicondemand.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class CustomerController {

    private final UserRepository userRepository;
    private final MechanicProfileRepository mechanicProfileRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public CustomerController(UserRepository userRepository, MechanicProfileRepository mechanicProfileRepository, BookingRepository bookingRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.mechanicProfileRepository = mechanicProfileRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/mechanics/city/{city}")
    public List<MechanicProfile> searchByCity(@PathVariable String city) {
        return mechanicProfileRepository.findByCityIgnoreCase(city);
    }

    @GetMapping("/mechanics/pincode/{pincode}")
    public List<MechanicProfile> searchByPincode(@PathVariable String pincode) {
        return mechanicProfileRepository.findByPincode(pincode);
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@AuthenticationPrincipal Long userId, @Valid @RequestBody BookingDtos.CreateBookingRequest req) {
        User customer = userRepository.findById(userId).orElseThrow();
        User mechanic = userRepository.findById(req.getMechanicId()).orElseThrow();
        if (mechanic.getRole() != Role.MECHANIC) {
            return ResponseEntity.badRequest().body("Selected user is not a mechanic");
        }
        Booking booking = Booking.builder()
                .customer(customer)
                .mechanic(mechanic)
                .status(BookingStatus.PENDING)
                .description(req.getDescription())
                .address(req.getAddress())
                .city(req.getCity())
                .pincode(req.getPincode())
                .scheduledAt(req.getScheduledAt())
                .build();
        bookingRepository.save(booking);
        notificationService.notify(mechanic, NotificationType.BOOKING_CREATED, "New booking request received");
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/bookings")
    public List<Booking> myBookings(@AuthenticationPrincipal Long userId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
    }
}
