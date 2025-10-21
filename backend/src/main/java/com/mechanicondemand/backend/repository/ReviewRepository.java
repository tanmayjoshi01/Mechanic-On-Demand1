package com.mechanicondemand.backend.repository;

import com.mechanicondemand.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMechanicIdOrderByCreatedAtDesc(Long mechanicId);
}
