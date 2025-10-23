package com.mechanicondemand.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class BookingDtos {
    @Data
    public static class CreateBookingRequest {
        @NotNull
        private Long mechanicId;
        @NotBlank
        private String description;
        private String address;
        private String city;
        private String pincode;
        @FutureOrPresent
        private Instant scheduledAt;
    }
}
