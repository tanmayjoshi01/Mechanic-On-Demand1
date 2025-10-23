package com.mechanicondemand.backend.controller;

import com.mechanicondemand.backend.model.MechanicProfile;
import com.mechanicondemand.backend.model.User;
import com.mechanicondemand.backend.repository.BookingRepository;
import com.mechanicondemand.backend.repository.MechanicProfileRepository;
import com.mechanicondemand.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final MechanicProfileRepository mechanicProfileRepository;
    private final BookingRepository bookingRepository;

    public AdminController(UserRepository userRepository, MechanicProfileRepository mechanicProfileRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.mechanicProfileRepository = mechanicProfileRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/users")
    public List<User> users() {
        return userRepository.findAll();
    }

    @GetMapping("/mechanics/pending")
    public List<MechanicProfile> pendingMechanics() {
        return mechanicProfileRepository.findAll().stream().filter(m -> !Boolean.TRUE.equals(m.getApprovedByAdmin())).toList();
    }

    @PostMapping("/mechanics/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        MechanicProfile m = mechanicProfileRepository.findById(id).orElseThrow();
        m.setApprovedByAdmin(true);
        mechanicProfileRepository.save(m);
        return ResponseEntity.ok(m);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Object> s = new HashMap<>();
        s.put("totalUsers", userRepository.count());
        s.put("totalMechanics", mechanicProfileRepository.count());
        s.put("totalBookings", bookingRepository.count());
        return s;
    }
}
