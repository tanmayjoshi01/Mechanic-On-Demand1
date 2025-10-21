package com.mechanicondemand.backend.repository;

import com.mechanicondemand.backend.model.MechanicProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MechanicProfileRepository extends JpaRepository<MechanicProfile, Long> {
    Optional<MechanicProfile> findByUserId(Long userId);
    List<MechanicProfile> findByCityIgnoreCase(String city);
    List<MechanicProfile> findByPincode(String pincode);
    List<MechanicProfile> findByApprovedByAdminTrue();
}
