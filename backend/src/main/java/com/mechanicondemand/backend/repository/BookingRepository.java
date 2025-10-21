package com.mechanicondemand.backend.repository;

import com.mechanicondemand.backend.model.Booking;
import com.mechanicondemand.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findByMechanicIdOrderByCreatedAtDesc(Long mechanicId);
    List<Booking> findByMechanicIdAndStatus(Long mechanicId, BookingStatus status);
    List<Booking> findByCreatedAtBetween(Instant start, Instant end);
}
