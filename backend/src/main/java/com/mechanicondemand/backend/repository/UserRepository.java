package com.mechanicondemand.backend.repository;

import com.mechanicondemand.backend.model.Role;
import com.mechanicondemand.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndCityIgnoreCase(Role role, String city);
    List<User> findByRoleAndPincode(Role role, String pincode);
}
