package com.mechanicondemand.controller;

import com.mechanicondemand.dto.MechanicProfileRequest;
import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.service.MechanicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/mechanic")
public class MechanicController {
    
    @Autowired
    private MechanicService mechanicService;
    
    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(@Valid @RequestBody MechanicProfileRequest request, Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            Mechanic mechanic = mechanicService.createMechanicProfile(userId, request);
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody MechanicProfileRequest request, Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            Mechanic mechanic = mechanicService.updateMechanicProfile(userId, request);
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            Mechanic mechanic = mechanicService.getMechanicProfile(userId);
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/availability")
    public ResponseEntity<?> toggleAvailability(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            Mechanic mechanic = mechanicService.toggleAvailability(userId);
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/search/city/{city}")
    public ResponseEntity<?> searchByCity(@PathVariable String city) {
        try {
            List<Mechanic> mechanics = mechanicService.searchMechanicsByCity(city);
            return ResponseEntity.ok(mechanics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/search/pincode/{pincode}")
    public ResponseEntity<?> searchByPincode(@PathVariable String pincode) {
        try {
            List<Mechanic> mechanics = mechanicService.searchMechanicsByPincode(pincode);
            return ResponseEntity.ok(mechanics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/search/skill/{skill}")
    public ResponseEntity<?> searchBySkill(@PathVariable String skill) {
        try {
            List<Mechanic> mechanics = mechanicService.searchMechanicsBySkill(skill);
            return ResponseEntity.ok(mechanics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    private Long getCurrentUserId(Authentication authentication) {
        return ((com.mechanicondemand.entity.User) authentication.getPrincipal()).getId();
    }
}