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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private MechanicRepository mechanicRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public Booking createBooking(BookingRequest bookingRequest, String username) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Mechanic mechanic = mechanicRepository.findById(bookingRequest.getMechanicId())
                .orElseThrow(() -> new RuntimeException("Mechanic not found"));
        
        Booking booking = new Booking(
                customer,
                mechanic,
                bookingRequest.getDescription(),
                bookingRequest.getAddress(),
                bookingRequest.getCity(),
                bookingRequest.getPincode(),
                bookingRequest.getPreferredDate()
        );
        
        booking.setEstimatedDuration(bookingRequest.getEstimatedDuration());
        booking.setNotes(bookingRequest.getNotes());
        
        // Calculate total cost based on estimated duration and hourly rate
        if (bookingRequest.getEstimatedDuration() != null && mechanic.getHourlyRate() != null) {
            booking.setTotalCost(bookingRequest.getEstimatedDuration() * mechanic.getHourlyRate());
        }
        
        booking = bookingRepository.save(booking);
        
        // Send notification to mechanic
        notificationService.createNotification(
                mechanic.getUser(),
                "New Booking Request",
                "You have received a new booking request from " + customer.getFirstName() + " " + customer.getLastName(),
                com.mechanicondemand.entity.NotificationType.BOOKING_CREATED,
                booking
        );
        
        return booking;
    }
    
    public List<Booking> getCustomerBookings(String username) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return bookingRepository.findByCustomer_Id(customer.getId());
    }
    
    public List<Booking> getMechanicBookings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Mechanic mechanic = mechanicRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
        
        return bookingRepository.findByMechanic_Id(mechanic.getId());
    }
    
    public Booking updateBookingStatus(Long bookingId, BookingStatus status, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user has permission to update this booking
        if (!booking.getCustomer().getId().equals(user.getId()) && 
            !booking.getMechanic().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to update this booking");
        }
        
        booking.setStatus(status);
        booking = bookingRepository.save(booking);
        
        // Send notifications
        if (status == BookingStatus.ACCEPTED) {
            notificationService.createNotification(
                    booking.getCustomer(),
                    "Booking Accepted",
                    "Your booking has been accepted by " + booking.getMechanic().getUser().getFirstName() + " " + booking.getMechanic().getUser().getLastName(),
                    com.mechanicondemand.entity.NotificationType.BOOKING_ACCEPTED,
                    booking
            );
        } else if (status == BookingStatus.REJECTED) {
            notificationService.createNotification(
                    booking.getCustomer(),
                    "Booking Rejected",
                    "Your booking has been rejected by " + booking.getMechanic().getUser().getFirstName() + " " + booking.getMechanic().getUser().getLastName(),
                    com.mechanicondemand.entity.NotificationType.BOOKING_REJECTED,
                    booking
            );
        } else if (status == BookingStatus.COMPLETED) {
            notificationService.createNotification(
                    booking.getCustomer(),
                    "Booking Completed",
                    "Your booking has been completed by " + booking.getMechanic().getUser().getFirstName() + " " + booking.getMechanic().getUser().getLastName(),
                    com.mechanicondemand.entity.NotificationType.BOOKING_COMPLETED,
                    booking
            );
            
            // Update mechanic's total jobs count
            Mechanic mechanic = booking.getMechanic();
            mechanic.setTotalJobs(mechanic.getTotalJobs() + 1);
            mechanicRepository.save(mechanic);
        }
        
        return booking;
    }
    
    public Optional<Booking> getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}