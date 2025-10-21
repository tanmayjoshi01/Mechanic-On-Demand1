package com.mechanicOnDemand.repository;

import com.mechanicOnDemand.model.Role;
import com.mechanicOnDemand.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByIsActive(Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.city = :city AND u.role = :role AND u.isActive = true")
    List<User> findActiveUsersByCityAndRole(@Param("city") String city, @Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.pincode = :pincode AND u.role = :role AND u.isActive = true")
    List<User> findActiveUsersByPincodeAndRole(@Param("pincode") String pincode, @Param("role") Role role);
}