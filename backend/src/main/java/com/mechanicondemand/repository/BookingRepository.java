package com.mechanicondemand.repository;

import com.mechanicondemand.entity.Booking;
import com.mechanicondemand.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_Id(Long customerId);
    List<Booking> findByMechanic_Id(Long mechanicId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByMechanic_IdAndStatus(Long mechanicId, BookingStatus status);
    List<Booking> findByCustomer_IdAndStatus(Long customerId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.mechanic.id = :mechanicId AND b.status IN :statuses")
    List<Booking> findByMechanic_IdAndStatusIn(@Param("mechanicId") Long mechanicId, @Param("statuses") List<BookingStatus> statuses);
    
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId AND b.status IN :statuses")
    List<Booking> findByCustomer_IdAndStatusIn(@Param("customerId") Long customerId, @Param("statuses") List<BookingStatus> statuses);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") BookingStatus status);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :startDate AND b.createdAt <= :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}