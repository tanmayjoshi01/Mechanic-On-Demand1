package com.mechanicOnDemand.service;

import com.mechanicOnDemand.dto.BookingRequest;
import com.mechanicOnDemand.model.*;
import com.mechanicOnDemand.repository.BookingRepository;
import com.mechanicOnDemand.repository.MechanicRepository;
import com.mechanicOnDemand.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MechanicRepository mechanicRepository;

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private WebSocketService webSocketService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getBookingsByMechanic(Long mechanicId) {
        return bookingRepository.findByMechanicIdOrderByCreatedAtDesc(mechanicId);
    }

    public Optional<Booking> getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public Booking createBooking(Long customerId, BookingRequest request) {
        Optional<User> customerOpt = userRepository.findById(customerId);
        Optional<Mechanic> mechanicOpt = mechanicRepository.findById(request.getMechanicId());

        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }
        if (mechanicOpt.isEmpty()) {
            throw new RuntimeException("Mechanic not found");
        }

        User customer = customerOpt.get();
        Mechanic mechanic = mechanicOpt.get();

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setMechanic(mechanic);
        booking.setProblemDescription(request.getProblemDescription());
        booking.setVehicleType(request.getVehicleType());
        booking.setVehicleModel(request.getVehicleModel());
        booking.setServiceLocation(request.getServiceLocation());
        booking.setPreferredDateTime(request.getPreferredDateTime());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // Send notification to mechanic
        notificationService.createNotification(
            mechanic.getUser(),
            "New Booking Request",
            "You have received a new booking request from " + customer.getFullName(),
            NotificationType.BOOKING_CREATED
        );

        return savedBooking;
    }

    public Booking updateBookingStatus(Long bookingId, BookingStatus status, String mechanicNotes) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(status);
        
        if (mechanicNotes != null) {
            booking.setMechanicNotes(mechanicNotes);
        }

        if (status == BookingStatus.ACCEPTED && oldStatus != BookingStatus.ACCEPTED) {
            booking.setAcceptedAt(LocalDateTime.now());
            // Send notification to customer
            notificationService.createNotification(
                booking.getCustomer(),
                "Booking Accepted",
                "Your booking request has been accepted by " + booking.getMechanic().getUser().getFullName(),
                NotificationType.BOOKING_ACCEPTED
            );
            // Send WebSocket update
            webSocketService.sendBookingUpdate(
                booking.getCustomer().getUsername(),
                booking.getId().toString(),
                "ACCEPTED",
                "Your booking has been accepted!"
            );
        } else if (status == BookingStatus.COMPLETED && oldStatus != BookingStatus.COMPLETED) {
            booking.setCompletedAt(LocalDateTime.now());
            // Send notification to customer
            notificationService.createNotification(
                booking.getCustomer(),
                "Service Completed",
                "Your service has been completed by " + booking.getMechanic().getUser().getFullName(),
                NotificationType.BOOKING_COMPLETED
            );
            // Send WebSocket update
            webSocketService.sendBookingUpdate(
                booking.getCustomer().getUsername(),
                booking.getId().toString(),
                "COMPLETED",
                "Your service has been completed!"
            );
        } else if (status == BookingStatus.REJECTED && oldStatus != BookingStatus.REJECTED) {
            // Send notification to customer
            notificationService.createNotification(
                booking.getCustomer(),
                "Booking Rejected",
                "Your booking request has been rejected by " + booking.getMechanic().getUser().getFullName(),
                NotificationType.BOOKING_REJECTED
            );
            // Send WebSocket update
            webSocketService.sendBookingUpdate(
                booking.getCustomer().getUsername(),
                booking.getId().toString(),
                "REJECTED",
                "Your booking has been rejected."
            );
        }

        return bookingRepository.save(booking);
    }

    public void cancelBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);

            // Send notification to mechanic
            notificationService.createNotification(
                booking.getMechanic().getUser(),
                "Booking Cancelled",
                "A booking has been cancelled by " + booking.getCustomer().getFullName(),
                NotificationType.BOOKING_CANCELLED
            );
        }
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public Long getBookingCountByStatus(BookingStatus status) {
        return bookingRepository.countByStatus(status);
    }
}