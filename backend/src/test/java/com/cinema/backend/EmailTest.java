package com.cinema.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.cinema.backend.services.EmailService;
import com.cinema.backend.utils.JwtTokenUtil;
import com.cinema.backend.dto.RegisterRequest;
import com.cinema.backend.dto.AddressRequest;
import com.cinema.backend.dto.CardRequest;
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
        // Edit Profile to add Address and Card info
        Long id = Long.valueOf(1);
        AddressRequest addrRequest = new AddressRequest("home", "2125 Plantation Land", 
                                    "Atlanta", "GA", "30341", "USA");
        String cardToken = JwtTokenUtil.generateToken(email);
        CardRequest cardRequest = new CardRequest("DISCOVER", "4701", 2, 
                                    2026, id, cardToken);
        userController.createAddress(id, addrRequest);
        userController.addCard(id, cardRequest);
        // Generate token
        //String verificationToken = JwtTokenUtil.generateToken(email);
        // Send email
        //emailService.sendVerificationEmail(email, verificationToken);
    }
    /*
     * Notes:
     * 1. Creating a User object in the database using UserController.register() works
     * 2. If you try to create a User with an existing email, they are not added to the 
     *    database (don't see exception though)
     */
}