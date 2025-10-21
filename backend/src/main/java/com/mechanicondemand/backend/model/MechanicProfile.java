package com.mechanicondemand.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mechanics", indexes = {
        @Index(columnList = "city"),
        @Index(columnList = "pincode"),
        @Index(columnList = "approvedByAdmin")
})
public class MechanicProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String skills;

    private Integer experienceYears;

    @Column(length = 1000)
    private String bio;

    private String city;

    private String pincode;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false)
    private Boolean approvedByAdmin = false;

    private Double averageRating;

    private Integer totalReviews;
}
