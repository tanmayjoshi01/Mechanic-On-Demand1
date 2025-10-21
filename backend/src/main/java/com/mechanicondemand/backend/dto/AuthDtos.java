package com.mechanicondemand.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthDtos {
    @Data
    public static class RegisterRequest {
        @NotBlank
        private String fullName;

        @Email
        @NotBlank
        private String email;

        @Size(min = 6)
        private String password;

        private String phone;
        private String city;
        private String pincode;

        @NotNull
        private String role; // CUSTOMER, MECHANIC, ADMIN (admin only by seeding)
    }

    @Data
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class JwtResponse {
        private String token;
        private String role;
        private String fullName;
        private Long userId;
    }
}
