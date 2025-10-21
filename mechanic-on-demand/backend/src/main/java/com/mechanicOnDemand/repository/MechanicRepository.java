package com.mechanicOnDemand.repository;

import com.mechanicOnDemand.model.Mechanic;
import com.mechanicOnDemand.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long> {
    Optional<Mechanic> findByUser(User user);
    Optional<Mechanic> findByUserId(Long userId);
    List<Mechanic> findByIsAvailable(Boolean isAvailable);
    List<Mechanic> findByIsVerified(Boolean isVerified);
    
    @Query("SELECT m FROM Mechanic m WHERE m.user.city = :city AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findAvailableMechanicsByCity(@Param("city") String city);
    
    @Query("SELECT m FROM Mechanic m WHERE m.user.pincode = :pincode AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findAvailableMechanicsByPincode(@Param("pincode") String pincode);
    
    @Query("SELECT m FROM Mechanic m WHERE m.skills LIKE %:skill% AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findBySkillsContaining(@Param("skill") String skill);
    
    @Query("SELECT m FROM Mechanic m WHERE (m.user.city = :city OR m.user.pincode = :pincode) AND m.skills LIKE %:skill% AND m.isAvailable = true AND m.isVerified = true")
    List<Mechanic> findMechanicsByCityOrPincodeAndSkill(@Param("city") String city, @Param("pincode") String pincode, @Param("skill") String skill);
}