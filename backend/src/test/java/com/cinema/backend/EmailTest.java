package com.cinema.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.cinema.backend.services.EmailService;
import com.cinema.backend.utils.JwtTokenUtil;
import com.cinema.backend.dto.RegisterRequest;
import com.cinema.backend.services.UserService;
import com.cinema.backend.controller.UserController;

@SpringBootTest
public class EmailTest {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserController userController;
    
    private String email = "cinemaebookingteam2@gmail.com";
    //private String email = "nathanhienn@gmail.com";
    
    @Test
    public void test() {
        // Create a new User object
        RegisterRequest request = new RegisterRequest(email, "password", "Nathan", 
                                    "Nguyen", "4045434898", false, 
                                    null, null);
        userController.register(request);
        // Generate token
        String verificationToken = JwtTokenUtil.generateToken(email);
        // Send email
        emailService.sendVerificationEmail(email, verificationToken);
    }
    
}