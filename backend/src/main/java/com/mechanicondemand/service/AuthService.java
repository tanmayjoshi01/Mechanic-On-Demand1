package com.mechanicondemand.service;

import com.mechanicondemand.dto.AuthResponse;
import com.mechanicondemand.dto.LoginRequest;
import com.mechanicondemand.dto.RegisterRequest;
import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.entity.Role;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.MechanicRepository;
import com.mechanicondemand.repository.UserRepository;
import com.mechanicondemand.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MechanicRepository mechanicRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        
        String jwt = jwtUtil.generateToken(user);
        
        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), 
                user.getFirstName(), user.getLastName(), user.getRole());
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        
        // Create user
        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getPhoneNumber(),
                registerRequest.getRole()
        );
        
        user = userRepository.save(user);
        
        // Create mechanic profile if role is MECHANIC
        if (registerRequest.getRole() == Role.MECHANIC) {
            Mechanic mechanic = new Mechanic(
                    user,
                    registerRequest.getSkills(),
                    registerRequest.getCity(),
                    registerRequest.getPincode(),
                    registerRequest.getAddress(),
                    registerRequest.getHourlyRate()
            );
            mechanicRepository.save(mechanic);
        }
        
        String jwt = jwtUtil.generateToken(user);
        
        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), 
                user.getFirstName(), user.getLastName(), user.getRole());
    }
}