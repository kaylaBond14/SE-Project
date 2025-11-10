package com.cinema.backend;

import java.util.LinkedList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.cinema.backend.services.EmailService;
import com.cinema.backend.utils.JwtTokenUtil;
import com.cinema.backend.dto.RegisterRequest;
import com.cinema.backend.dto.ResetPasswordRequest;
import com.cinema.backend.dto.UpdateUserRequest;
import com.cinema.backend.model.User;
import com.cinema.backend.repository.UserRepository;
import com.cinema.backend.dto.AddressRequest;
import com.cinema.backend.dto.CardRequest;
import com.cinema.backend.dto.CardRequestDuringRegister;
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

    @Autowired
    private UserRepository users;
    
    //private String email = "cinemaebookingteam2@gmail.com";
    private String email = "nathanhienn@gmail.com";
    
    @Test
    public void test() {
        // Create a new User object
        AddressRequest billingAddrReq = new AddressRequest("home", "2125 Plantation Land", 
                                    "Atlanta", "GA", "30341", "USA");
        CardRequestDuringRegister cardReq = new CardRequestDuringRegister("DISCOVER", "4701", 2, 
                                    2026, billingAddrReq, "1234567891234701");
        List<CardRequestDuringRegister> cards = new LinkedList<CardRequestDuringRegister>();
        cards.add(cardReq);
        RegisterRequest request = new RegisterRequest(email, "password", "Nathan", 
                                    "Nguyen", "4045434898", false, 
                                        null, cards);
        userController.register(request);
        /*
        // Edit Profile to add Address and Card info
        Long id = Long.valueOf(7);
        AddressRequest addrRequest = new AddressRequest("home", "2125 Plantation Land", 
                                    "Atlanta", "GA", "30341", "USA");
        String cardToken = JwtTokenUtil.generateToken(email);
        CardRequest cardRequest = new CardRequest("DISCOVER", "4701", 2, 
                                    2026, id, cardToken);
        userController.createAddress(id, addrRequest);
        userController.addCard(id, cardRequest);
        */
        // Edit Profile to change existing User, Address, and Card info
        Long id = Long.valueOf(7);
        Long addrID = Long.valueOf(3);
        Long cardID = Long.valueOf(3);
        UpdateUserRequest updateUserReq = new UpdateUserRequest("Bobby", "Hill", 
                                   "1234567899", true);
        AddressRequest updateAddrReq = new AddressRequest("home", "1234 Apple Lane", 
                                    "Boston", "MA", "30341", "USA");
        String newCardToken = JwtTokenUtil.generateToken(email);
        CardRequest updateCardReq = new CardRequest("MASTERCARD", "1234123412341234", 
                                    "1234", 4, 2030, updateAddrReq, false);
        //userController.updateUser(id, updateUserReq);
        //userController.patchAddress(id, addrID, updateAddrReq);
        userController.patchCard(id, cardID, updateCardReq);
        /*
        // Test suspending and deleting
        Long id = Long.valueOf(1);
        Long cardID = Long.valueOf(3);
        userController.setSuspended(id, true);
        userController.deleteCard(id, cardID);
        */
        // Test "Forgot Password" functionality
        //ResetPasswordRequest resetReq = new ResetPasswordRequest(email, "superSecurePassword");
        //userController.resetPassword(resetReq);
    }
    /*
     * Notes:
     * 1. Creating a User object in the database using UserController.register() works
     * 2. If you try to create a User with an existing email, they are not added to the 
     *    database (don't see exception though)
     * 3. Adding Address and Card info to an existing User object using createAddress()
     *    and addCard() works
     * 4. Editing existing User, Address, and Card info using updateUser(), patchAddress()
     *    and patchCard() works
     * 5. setSuspended() and deleteCard() work
     * 6. sendProfileEdited() email works and is attached to all respective edit() methods
     * 7. VerificationController works, fully implemented with UserController.register()
     * 8. UserController.resetPassword() works
     */
}