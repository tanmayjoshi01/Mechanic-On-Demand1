package com.mechanicOnDemand.service;

import com.mechanicOnDemand.dto.MechanicProfileRequest;
import com.mechanicOnDemand.model.Mechanic;
import com.mechanicOnDemand.model.User;
import com.mechanicOnDemand.repository.MechanicRepository;
import com.mechanicOnDemand.repository.UserRepository;
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

    public List<Mechanic> getAllMechanics() {
        return mechanicRepository.findAll();
    }

    public List<Mechanic> getAvailableMechanics() {
        return mechanicRepository.findByIsAvailable(true);
    }

    public List<Mechanic> getMechanicsByCity(String city) {
        return mechanicRepository.findAvailableMechanicsByCity(city);
    }

    public List<Mechanic> getMechanicsByPincode(String pincode) {
        return mechanicRepository.findAvailableMechanicsByPincode(pincode);
    }

    public List<Mechanic> searchMechanicsBySkill(String skill) {
        return mechanicRepository.findBySkillsContaining(skill);
    }

    public Optional<Mechanic> getMechanicById(Long id) {
        return mechanicRepository.findById(id);
    }

    public Optional<Mechanic> getMechanicByUserId(Long userId) {
        return mechanicRepository.findByUserId(userId);
    }

    public Mechanic createMechanicProfile(Long userId, MechanicProfileRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        Optional<Mechanic> existingMechanic = mechanicRepository.findByUser(user);
        
        Mechanic mechanic;
        if (existingMechanic.isPresent()) {
            mechanic = existingMechanic.get();
        } else {
            mechanic = new Mechanic();
            mechanic.setUser(user);
        }

        mechanic.setSkills(request.getSkills());
        mechanic.setDescription(request.getDescription());
        mechanic.setHourlyRate(request.getHourlyRate());
        mechanic.setYearsOfExperience(request.getYearsOfExperience());
        mechanic.setCertifications(request.getCertifications());
        if (request.getIsAvailable() != null) {
            mechanic.setIsAvailable(request.getIsAvailable());
        }

        return mechanicRepository.save(mechanic);
    }

    public Mechanic updateMechanicProfile(Long mechanicId, MechanicProfileRequest request) {
        Optional<Mechanic> mechanicOpt = mechanicRepository.findById(mechanicId);
        if (mechanicOpt.isEmpty()) {
            throw new RuntimeException("Mechanic not found");
        }

        Mechanic mechanic = mechanicOpt.get();
        if (request.getSkills() != null) {
            mechanic.setSkills(request.getSkills());
        }
        if (request.getDescription() != null) {
            mechanic.setDescription(request.getDescription());
        }
        if (request.getHourlyRate() != null) {
            mechanic.setHourlyRate(request.getHourlyRate());
        }
        if (request.getYearsOfExperience() != null) {
            mechanic.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getCertifications() != null) {
            mechanic.setCertifications(request.getCertifications());
        }
        if (request.getIsAvailable() != null) {
            mechanic.setIsAvailable(request.getIsAvailable());
        }

        return mechanicRepository.save(mechanic);
    }

    public void verifyMechanic(Long mechanicId) {
        Optional<Mechanic> mechanicOpt = mechanicRepository.findById(mechanicId);
        if (mechanicOpt.isPresent()) {
            Mechanic mechanic = mechanicOpt.get();
            mechanic.setIsVerified(true);
            mechanicRepository.save(mechanic);
        }
    }

    public void deleteMechanic(Long mechanicId) {
        mechanicRepository.deleteById(mechanicId);
    }
}