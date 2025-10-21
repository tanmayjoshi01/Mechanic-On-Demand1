package com.mechanicondemand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class BookingRequest {
    
    @NotNull
    private Long mechanicId;
    
    @NotBlank
    @Size(max = 200)
    private String serviceDescription;
    
    @NotBlank
    @Size(max = 200)
    private String address;
    
    @NotBlank
    @Size(max = 100)
    private String city;
    
    @NotBlank
    @Size(max = 10)
    private String pincode;
    
    @NotNull
    private LocalDateTime preferredDate;
    
    @NotNull
    @Positive
    private Integer estimatedDuration;
    
    @Size(max = 500)
    private String notes;
    
    public BookingRequest() {}
    
    public BookingRequest(Long mechanicId, String serviceDescription, String address, 
                         String city, String pincode, LocalDateTime preferredDate, 
                         Integer estimatedDuration, String notes) {
        this.mechanicId = mechanicId;
        this.serviceDescription = serviceDescription;
        this.address = address;
        this.city = city;
        this.pincode = pincode;
        this.preferredDate = preferredDate;
        this.estimatedDuration = estimatedDuration;
        this.notes = notes;
    }
    
    // Getters and Setters
    public Long getMechanicId() { return mechanicId; }
    public void setMechanicId(Long mechanicId) { this.mechanicId = mechanicId; }
    
    public String getServiceDescription() { return serviceDescription; }
    public void setServiceDescription(String serviceDescription) { this.serviceDescription = serviceDescription; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    
    public LocalDateTime getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDateTime preferredDate) { this.preferredDate = preferredDate; }
    
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}