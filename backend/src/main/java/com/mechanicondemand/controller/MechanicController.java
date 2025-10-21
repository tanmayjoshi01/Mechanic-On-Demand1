package com.mechanicondemand.controller;

import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.service.MechanicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mechanic")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MechanicController {
    
    @Autowired
    private MechanicService mechanicService;
    
    @GetMapping("/search/city/{city}")
    public ResponseEntity<List<Mechanic>> getMechanicsByCity(@PathVariable String city) {
        List<Mechanic> mechanics = mechanicService.getAvailableMechanicsByCity(city);
        return ResponseEntity.ok(mechanics);
    }
    
    @GetMapping("/search/pincode/{pincode}")
    public ResponseEntity<List<Mechanic>> getMechanicsByPincode(@PathVariable String pincode) {
        List<Mechanic> mechanics = mechanicService.getAvailableMechanicsByPincode(pincode);
        return ResponseEntity.ok(mechanics);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Mechanic> getMechanicProfile(Authentication authentication) {
        try {
            Mechanic mechanic = mechanicService.getMechanicProfile(authentication.getName());
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<Mechanic> updateMechanicProfile(@RequestBody Mechanic mechanic, Authentication authentication) {
        try {
            Mechanic updatedMechanic = mechanicService.updateMechanicProfile(mechanic, authentication.getName());
            return ResponseEntity.ok(updatedMechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Mechanic>> getAllMechanics() {
        List<Mechanic> mechanics = mechanicService.getAllMechanics();
        return ResponseEntity.ok(mechanics);
    }
    
    @GetMapping("/unverified")
    public ResponseEntity<List<Mechanic>> getUnverifiedMechanics() {
        List<Mechanic> mechanics = mechanicService.getUnverifiedMechanics();
        return ResponseEntity.ok(mechanics);
    }
    
    @PutMapping("/verify/{mechanicId}")
    public ResponseEntity<Mechanic> verifyMechanic(@PathVariable Long mechanicId) {
        try {
            Mechanic mechanic = mechanicService.verifyMechanic(mechanicId);
            return ResponseEntity.ok(mechanic);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{mechanicId}")
    public ResponseEntity<Mechanic> getMechanicById(@PathVariable Long mechanicId) {
        return mechanicService.getMechanicById(mechanicId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}