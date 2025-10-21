package com.mechanicondemand.repository;

import com.mechanicondemand.entity.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {
    Optional<Mechanic> findByUser_Id(Long userId);
    List<Mechanic> findByCityAndIsAvailableTrue(String city);
    List<Mechanic> findByPincodeAndIsAvailableTrue(String pincode);
    List<Mechanic> findByIsVerifiedTrue();
    List<Mechanic> findByIsVerifiedFalse();
    
    @Query("SELECT m FROM Mechanic m WHERE m.city = :city AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findAvailableVerifiedMechanicsByCity(@Param("city") String city);
    
    @Query("SELECT m FROM Mechanic m WHERE m.pincode = :pincode AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findAvailableVerifiedMechanicsByPincode(@Param("pincode") String pincode);
}