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
    Optional<Mechanic> findByUserId(Long userId);
    List<Mechanic> findByCity(String city);
    List<Mechanic> findByPincode(String pincode);
    List<Mechanic> findByIsAvailable(Boolean isAvailable);
    List<Mechanic> findByIsVerified(Boolean isVerified);
    
    @Query("SELECT m FROM Mechanic m WHERE m.city = :city AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findAvailableMechanicsByCity(@Param("city") String city);
    
    @Query("SELECT m FROM Mechanic m WHERE m.pincode = :pincode AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findAvailableMechanicsByPincode(@Param("pincode") String pincode);
    
    @Query("SELECT m FROM Mechanic m WHERE m.skills LIKE %:skill% AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findMechanicsBySkill(@Param("skill") String skill);
}