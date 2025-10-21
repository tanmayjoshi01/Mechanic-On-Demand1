package com.mechanicOnDemand.repository;

import com.mechanicOnDemand.model.Mechanic;
import com.mechanicOnDemand.model.Review;
import com.mechanicOnDemand.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCustomer(User customer);
    List<Review> findByMechanic(Mechanic mechanic);
    
    @Query("SELECT r FROM Review r WHERE r.mechanic.id = :mechanicId ORDER BY r.createdAt DESC")
    List<Review> findByMechanicIdOrderByCreatedAtDesc(@Param("mechanicId") Long mechanicId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.mechanic.id = :mechanicId")
    BigDecimal findAverageRatingByMechanic(@Param("mechanicId") Long mechanicId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.mechanic.id = :mechanicId")
    Long countReviewsByMechanic(@Param("mechanicId") Long mechanicId);
}