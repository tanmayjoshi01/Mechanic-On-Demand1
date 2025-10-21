package com.mechanicOnDemand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class BookingRequest {
    @NotNull
    private Long mechanicId;

    @NotBlank
    @Size(max = 1000)
    private String problemDescription;

    @Size(max = 50)
    private String vehicleType;

    @Size(max = 50)
    private String vehicleModel;

    @NotBlank
    @Size(max = 200)
    private String serviceLocation;

    private LocalDateTime preferredDateTime;

    public BookingRequest() {}

    public BookingRequest(Long mechanicId, String problemDescription, String serviceLocation) {
        this.mechanicId = mechanicId;
        this.problemDescription = problemDescription;
        this.serviceLocation = serviceLocation;
    }

    // Getters and Setters
    public Long getMechanicId() { return mechanicId; }
    public void setMechanicId(Long mechanicId) { this.mechanicId = mechanicId; }

    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public String getServiceLocation() { return serviceLocation; }
    public void setServiceLocation(String serviceLocation) { this.serviceLocation = serviceLocation; }

    public LocalDateTime getPreferredDateTime() { return preferredDateTime; }
    public void setPreferredDateTime(LocalDateTime preferredDateTime) { this.preferredDateTime = preferredDateTime; }
}