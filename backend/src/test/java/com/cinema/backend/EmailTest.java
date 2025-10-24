package com.cinema.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.cinema.backend.services.EmailService;
import com.cinema.backend.utils.JwtTokenUtil;

@SpringBootTest
public class EmailTest {

    @Autowired
    private EmailService emailService;
    
    private String email = "cinemaebookingteam2@gmail.com";
    //private String email = "nathanhienn@gmail.com";
    
    @Test
    public void test() {
        // Generate token
        String verificationToken = JwtTokenUtil.generateToken(email);
        // Send email
        emailService.sendVerificationEmail(email, verificationToken);
    }
    
}