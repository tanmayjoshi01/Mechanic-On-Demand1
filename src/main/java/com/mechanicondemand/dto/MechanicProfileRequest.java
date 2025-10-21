package com.mechanicondemand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class MechanicProfileRequest {
    
    @NotBlank
    @Size(max = 200)
    private String skills;
    
    @NotBlank
    @Size(max = 100)
    private String city;
    
    @NotBlank
    @Size(max = 10)
    private String pincode;
    
    @NotBlank
    @Size(max = 200)
    private String address;
    
    @NotNull
    @Positive
    private Double hourlyRate;
    
    public MechanicProfileRequest() {}
    
    public MechanicProfileRequest(String skills, String city, String pincode, String address, Double hourlyRate) {
        this.skills = skills;
        this.city = city;
        this.pincode = pincode;
        this.address = address;
        this.hourlyRate = hourlyRate;
    }
    
    // Getters and Setters
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
}