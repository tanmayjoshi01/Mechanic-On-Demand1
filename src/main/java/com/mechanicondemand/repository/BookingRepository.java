package com.mechanicondemand.repository;

import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.BookingStatus;
import com.mechanicondemand.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByMechanicId(Long mechanicId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByCustomerIdAndStatus(Long customerId, BookingStatus status);
    List<Booking> findByMechanicIdAndStatus(Long mechanicId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findCustomerBookingsOrderByCreatedAt(@Param("customerId") Long customerId);
    
    @Query("SELECT b FROM Booking b WHERE b.mechanic.id = :mechanicId ORDER BY b.createdAt DESC")
    List<Booking> findMechanicBookingsOrderByCreatedAt(@Param("mechanicId") Long mechanicId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") BookingStatus status);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :startDate AND b.createdAt <= :endDate")
    Long countBookingsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}