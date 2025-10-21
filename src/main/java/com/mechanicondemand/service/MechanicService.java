package com.mechanicondemand.service;

import com.mechanicondemand.dto.MechanicProfileRequest;
import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.MechanicRepository;
import com.mechanicondemand.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MechanicService {
    
    @Autowired
    private MechanicRepository mechanicRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Mechanic createMechanicProfile(Long userId, MechanicProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (mechanicRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Mechanic profile already exists for this user");
        }
        
        Mechanic mechanic = new Mechanic(user, request.getSkills(), request.getCity(),
                request.getPincode(), request.getAddress(), request.getHourlyRate());
        
        return mechanicRepository.save(mechanic);
    }
    
    public Mechanic updateMechanicProfile(Long userId, MechanicProfileRequest request) {
        Mechanic mechanic = mechanicRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
        
        mechanic.setSkills(request.getSkills());
        mechanic.setCity(request.getCity());
        mechanic.setPincode(request.getPincode());
        mechanic.setAddress(request.getAddress());
        mechanic.setHourlyRate(request.getHourlyRate());
        
        return mechanicRepository.save(mechanic);
    }
    
    public Mechanic getMechanicProfile(Long userId) {
        return mechanicRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
    }
    
    public List<Mechanic> searchMechanicsByCity(String city) {
        return mechanicRepository.findAvailableMechanicsByCity(city);
    }
    
    public List<Mechanic> searchMechanicsByPincode(String pincode) {
        return mechanicRepository.findAvailableMechanicsByPincode(pincode);
    }
    
    public List<Mechanic> searchMechanicsBySkill(String skill) {
        return mechanicRepository.findMechanicsBySkill(skill);
    }
    
    public Mechanic toggleAvailability(Long userId) {
        Mechanic mechanic = mechanicRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
        
        mechanic.setIsAvailable(!mechanic.getIsAvailable());
        return mechanicRepository.save(mechanic);
    }
    
    public List<Mechanic> getAllMechanics() {
        return mechanicRepository.findAll();
    }
    
    public Mechanic verifyMechanic(Long mechanicId) {
        Mechanic mechanic = mechanicRepository.findById(mechanicId)
                .orElseThrow(() -> new RuntimeException("Mechanic not found"));
        
        mechanic.setIsVerified(true);
        return mechanicRepository.save(mechanic);
    }
}