package com.mechanicondemand.service;

import com.mechanicondemand.dto.BookingRequest;
import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.BookingStatus;
import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.BookingRepository;
import com.mechanicondemand.repository.MechanicRepository;
import com.mechanicondemand.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
    
    public Booking createBooking(Long customerId, BookingRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Mechanic mechanic = mechanicRepository.findById(request.getMechanicId())
                .orElseThrow(() -> new RuntimeException("Mechanic not found"));
        
        if (!mechanic.getIsAvailable() || !mechanic.getIsVerified()) {
            throw new RuntimeException("Mechanic is not available or not verified");
        }
        
        Booking booking = new Booking(customer, mechanic, request.getServiceDescription(),
                request.getAddress(), request.getCity(), request.getPincode(),
                request.getPreferredDate(), request.getEstimatedDuration());
        
        booking.setNotes(request.getNotes());
        booking.setTotalCost(mechanic.getHourlyRate() * request.getEstimatedDuration());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to mechanic
        notificationService.createNotification(mechanic.getUser().getId(),
                "New Booking Request",
                "You have received a new booking request from " + customer.getFirstName() + " " + customer.getLastName(),
                com.mechanicondemand.entity.NotificationType.BOOKING_REQUEST, savedBooking);
        
        return savedBooking;
    }
    
    public Booking acceptBooking(Long mechanicId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getMechanic().getId().equals(mechanicId)) {
            throw new RuntimeException("Unauthorized to accept this booking");
        }
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending status");
        }
        
        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setAcceptedAt(LocalDateTime.now());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to customer
        notificationService.createNotification(booking.getCustomer().getId(),
                "Booking Accepted",
                "Your booking has been accepted by " + booking.getMechanic().getUser().getFirstName() + " " + booking.getMechanic().getUser().getLastName(),
                com.mechanicondemand.entity.NotificationType.BOOKING_ACCEPTED, savedBooking);
        
        return savedBooking;
    }
    
    public Booking rejectBooking(Long mechanicId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getMechanic().getId().equals(mechanicId)) {
            throw new RuntimeException("Unauthorized to reject this booking");
        }
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending status");
        }
        
        booking.setStatus(BookingStatus.REJECTED);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to customer
        notificationService.createNotification(booking.getCustomer().getId(),
                "Booking Rejected",
                "Your booking has been rejected by " + booking.getMechanic().getUser().getFirstName() + " " + booking.getMechanic().getUser().getLastName(),
                com.mechanicondemand.entity.NotificationType.BOOKING_REJECTED, savedBooking);
        
        return savedBooking;
    }
    
    public Booking completeBooking(Long mechanicId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getMechanic().getId().equals(mechanicId)) {
            throw new RuntimeException("Unauthorized to complete this booking");
        }
        
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Booking must be accepted before completion");
        }
        
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setCompletedAt(LocalDateTime.now());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update mechanic's total jobs and rating
        Mechanic mechanic = booking.getMechanic();
        mechanic.setTotalJobs(mechanic.getTotalJobs() + 1);
        mechanicRepository.save(mechanic);
        
        // Send notification to customer
        notificationService.createNotification(booking.getCustomer().getId(),
                "Booking Completed",
                "Your booking has been completed by " + booking.getMechanic().getUser().getFirstName() + " " + booking.getMechanic().getUser().getLastName(),
                com.mechanicondemand.entity.NotificationType.BOOKING_COMPLETED, savedBooking);
        
        return savedBooking;
    }
    
    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findCustomerBookingsOrderByCreatedAt(customerId);
    }
    
    public List<Booking> getMechanicBookings(Long mechanicId) {
        return bookingRepository.findMechanicBookingsOrderByCreatedAt(mechanicId);
    }
    
    public List<Booking> getPendingBookingsForMechanic(Long mechanicId) {
        return bookingRepository.findMechanicIdAndStatus(mechanicId, BookingStatus.PENDING);
    }
    
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}