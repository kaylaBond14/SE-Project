package com.cinema.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.backend.model.User;
import com.cinema.backend.repository.UserRepository;
import com.cinema.backend.services.UserService;
import com.cinema.backend.utils.JwtTokenUtil;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/req")
public class VerificationController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenUtil jwtUtil;
     
    @GetMapping("/signup/verify")
    public ResponseEntity verifyEmail(@RequestParam("token") String token) {
        String emailString = jwtUtil.extractEmail(token);
        User user = userService.getByEmail(emailString);
        if (user == null || user.getVerificationToken() == "pending") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token Expired!");
        }
        
        if (!jwtUtil.validateToken(token) || !user.getVerificationToken().equals(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token Expired!");
        }
        user.setVerificationToken("verified");
        user.setVerified(true);  
        userRepository.save(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body("Email successfully verified!");
    }

    @GetMapping("/reset-password")
    public ResponseEntity resetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
        String emailString = jwtUtil.extractEmail(token);
        User user = userService.getByEmail(emailString);
        if (user == null || user.getResetToken() == "pending") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token Expired!");
        }
        
        if (!jwtUtil.validateToken(token) || !user.getResetToken().equals(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token Expired!");
        }
        user.setResetToken("pending");
        user.setPasswordHash(newPassword); 
        userRepository.save(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body("Your password has been reset! Please return to the Login page and use your new password to access your account.");
    }
    
    
}