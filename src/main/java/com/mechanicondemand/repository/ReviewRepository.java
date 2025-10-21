package com.mechanicondemand.repository;

import com.mechanicondemand.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMechanicId(Long mechanicId);
    List<Review> findByCustomerId(Long customerId);
    List<Review> findByBookingId(Long bookingId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.mechanic.id = :mechanicId")
    Double findAverageRatingByMechanicId(@Param("mechanicId") Long mechanicId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.mechanic.id = :mechanicId")
    Long countReviewsByMechanicId(@Param("mechanicId") Long mechanicId);
}