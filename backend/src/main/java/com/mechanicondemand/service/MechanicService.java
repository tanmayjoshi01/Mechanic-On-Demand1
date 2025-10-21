package com.mechanicondemand.service;

import com.mechanicondemand.entity.Mechanic;
import com.mechanicondemand.entity.User;
import com.mechanicondemand.repository.MechanicRepository;
import com.mechanicondemand.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MechanicService {
    
    @Autowired
    private MechanicRepository mechanicRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Mechanic> getAvailableMechanicsByCity(String city) {
        return mechanicRepository.findAvailableVerifiedMechanicsByCity(city);
    }
    
    public List<Mechanic> getAvailableMechanicsByPincode(String pincode) {
        return mechanicRepository.findAvailableVerifiedMechanicsByPincode(pincode);
    }
    
    public Mechanic getMechanicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return mechanicRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
    }
    
    public Mechanic updateMechanicProfile(Mechanic mechanic, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Mechanic existingMechanic = mechanicRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Mechanic profile not found"));
        
        existingMechanic.setSkills(mechanic.getSkills());
        existingMechanic.setCity(mechanic.getCity());
        existingMechanic.setPincode(mechanic.getPincode());
        existingMechanic.setAddress(mechanic.getAddress());
        existingMechanic.setHourlyRate(mechanic.getHourlyRate());
        existingMechanic.setIsAvailable(mechanic.getIsAvailable());
        
        return mechanicRepository.save(existingMechanic);
    }
    
    public List<Mechanic> getAllMechanics() {
        return mechanicRepository.findAll();
    }
    
    public List<Mechanic> getUnverifiedMechanics() {
        return mechanicRepository.findByIsVerifiedFalse();
    }
    
    public Mechanic verifyMechanic(Long mechanicId) {
        Mechanic mechanic = mechanicRepository.findById(mechanicId)
                .orElseThrow(() -> new RuntimeException("Mechanic not found"));
        
        mechanic.setIsVerified(true);
        return mechanicRepository.save(mechanic);
    }
    
    public Optional<Mechanic> getMechanicById(Long mechanicId) {
        return mechanicRepository.findById(mechanicId);
    }
}