package com.mechanicOnDemand.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class MechanicProfileRequest {
    @Size(max = 500)
    private String skills;

    @Size(max = 1000)
    private String description;

    @DecimalMin(value = "0.0", inclusive = false)
    @DecimalMax(value = "10000.0")
    private BigDecimal hourlyRate;

    private Integer yearsOfExperience;

    @Size(max = 200)
    private String certifications;

    private Boolean isAvailable;

    public MechanicProfileRequest() {}

    // Getters and Setters
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}