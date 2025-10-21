package com.mechanicOnDemand.repository;

import com.mechanicOnDemand.model.Booking;
import com.mechanicOnDemand.model.BookingStatus;
import com.mechanicOnDemand.model.Mechanic;
import com.mechanicOnDemand.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
    List<Booking> findByMechanic(Mechanic mechanic);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByCustomerAndStatus(User customer, BookingStatus status);
    List<Booking> findByMechanicAndStatus(Mechanic mechanic, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(@Param("customerId") Long customerId);
    
    @Query("SELECT b FROM Booking b WHERE b.mechanic.id = :mechanicId ORDER BY b.createdAt DESC")
    List<Booking> findByMechanicIdOrderByCreatedAtDesc(@Param("mechanicId") Long mechanicId);
    
    @Query("SELECT b FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate")
    List<Booking> findBookingsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") BookingStatus status);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.mechanic.id = :mechanicId AND b.status = 'COMPLETED'")
    Long countCompletedBookingsByMechanic(@Param("mechanicId") Long mechanicId);
}