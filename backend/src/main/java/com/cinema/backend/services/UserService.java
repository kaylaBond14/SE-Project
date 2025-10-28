package com.cinema.backend.services;

import com.cinema.backend.model.User;
import com.cinema.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cinema.backend.dto.*;
import com.cinema.backend.model.Address;
import com.cinema.backend.model.PaymentCard;
import com.cinema.backend.model.UserStatus;
import com.cinema.backend.model.UserType;
import com.cinema.backend.repository.AddressRepository;
import com.cinema.backend.repository.PaymentCardRepository;
import com.cinema.backend.repository.UserStatusRepository; 
import com.cinema.backend.repository.UserTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.cinema.backend.services.EmailService;
import com.cinema.backend.utils.JwtTokenUtil;



// Will call userRepository.findById()
// Will format or hde info before sending to controller
// So, hashing passwords before saving them.
@Service
@Transactional
public class UserService {


    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PaymentCardRepository cardRepository;
    private final UserStatusRepository statusRepository;
    private final UserTypeRepository typeRepository;

    @Autowired
    private EmailService emailService;


    public UserService(
                UserRepository users, 
                PasswordEncoder passwordEncoder,
                UserRepository userRepository,
                AddressRepository addressRepository,
                PaymentCardRepository cardRepository,
                UserStatusRepository statusRepository,
                UserTypeRepository typeRepository
                ) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.cardRepository = cardRepository;
        this.statusRepository = statusRepository;
        this.typeRepository = typeRepository;
    }

    @Transactional(readOnly = true)
    public User getById(Long id) {
        return users.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }

    /**
     * Parial update of user basics
     */
    public User updateBasics(Long id, String firstName, String lastName, String phone, Boolean promoOptIn) {
        User user = getById(id);

        if (firstName != null && !firstName.isBlank()) {
            user.setFirstName(firstName);
        }
        if (lastName != null && !lastName.isBlank()) {
            user.setLastName(lastName);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        if (promoOptIn != null) {
            user.setPromoOptIn(promoOptIn);
        }

        emailService.sendProfileEditedEmail(user.getEmail()); // Notify user their profile changed
        return users.save(user);
    }

    /**
     * Change password by verify current password
     */
    public void changePassword(Long id, String currentPassword, String newPassword) {
        User user = getById(id);

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        users.save(user);
        emailService.sendProfileEditedEmail(user.getEmail()); // Notify user their profile changed
    }

    /**
     * Reset password / Fogot password option
     */
    public void resetPassword(String email, String newPassword) {
        User user = getByEmail(email);

        String newEncodedPassword = passwordEncoder.encode(newPassword);
        // Send Reset Passwork email
        String resetToken = JwtTokenUtil.generateToken(user.getEmail());
        user.setResetToken(resetToken);
        emailService.sendForgotPasswordEmail(user.getEmail(), resetToken, newEncodedPassword);
        users.save(user);
    }

    /**
     * Admin: suspend or unsuspend account
     */
    public void setSuspended(Long id, boolean suspend) {
        User user = getById(id);
        user.setAccountSuspended(suspend);
        users.save(user);
    }

    public User register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User u = new User();
        u.setEmail(req.email());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setFirstName(req.firstName());
        u.setLastName(req.lastName());
        u.setPhone(req.phone());
        u.setPromoOptIn(Boolean.TRUE.equals(req.promoOptIn()));
        u.setVerified(false);
        u.setAccountSuspended(false);

        // default status/type
        UserStatus active = statusRepository.findByStatusName("Active")
                .orElseThrow(() -> new IllegalStateException("Missing lookup: user_statuses.Active"));
        UserType customer = typeRepository.findByTypeName("Customer")
                .orElseThrow(() -> new IllegalStateException("Missing lookup: user_types.Customer"));
        u.setStatus(active);
        u.setUserType(customer);

        // tokens per schema (NOT NULL)
        u.setResetToken("pending");       
        u.setVerificationToken("pending");
        userRepository.save(u);

        // Update: upsert the ONE address, then saveAndFlush so it has a real ID 
        Address savedAddress = null;
        if (req.address() != null) {
            savedAddress = upsertSingleAddress(u, req.address()); // ensures addresses.id exists now
        }

        // Update: cards reference the just saved address
        if (req.cards() != null && !req.cards().isEmpty()) {
            for (CardRequest c : req.cards()) {
                if (cardRepository.countByUserId(u.getId()) >= 3) {
                    throw new IllegalArgumentException("Card limit exceeded (max 3).");
                }
                saveCardForUser(u, savedAddress, c);
            }
        }

        // Send verification email
        String verificationToken = JwtTokenUtil.generateToken(u.getEmail());
        u.setVerificationToken(verificationToken);
        emailService.sendVerificationEmail(u.getEmail(), verificationToken);

        return u;
    }

    // Address ops (1 per user)
    public Address getAddress(Long userId) {
        return addressRepository.findByUserId(userId).orElseThrow(() -> new EntityNotFoundException("No address"));
    }

    public Address createAddress(Long userId, AddressRequest req) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        // enforce single address per user
        if (addressRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Address already exists for user");
        }
        Address a = new Address();
        a.setUser(user);
        a.setLabel(req.label() == null ? "home" : req.label());
        a.setStreet(req.street());
        a.setCity(req.city());
        a.setState(req.state());
        a.setPostalCode(req.postalCode());
        a.setCountry(req.country() == null ? "USA" : req.country());
        emailService.sendProfileEditedEmail(user.getEmail()); // Notify user their profile changed
        return addressRepository.save(a);
    }

    public Address patchAddress(Long userId, Long addressId, AddressRequest req) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        Address a = addressRepository.findById(addressId).orElseThrow(EntityNotFoundException::new);
        if (!a.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Address not owned by user");

        if (req.label() != null) a.setLabel(req.label());
        if (req.street() != null) a.setStreet(req.street());
        if (req.city() != null) a.setCity(req.city());
        if (req.state() != null) a.setState(req.state());
        if (req.postalCode() != null) a.setPostalCode(req.postalCode());
        if (req.country() != null) a.setCountry(req.country());

        emailService.sendProfileEditedEmail(user.getEmail()); // Notify user their profile changed
        return addressRepository.save(a);
    }

    // Cards


    public List<PaymentCard> listCards(Long userId) {
        userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        return cardRepository.findByUserId(userId);
    }

    public PaymentCard addCard(Long userId, CardRequest req) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);

        if (cardRepository.countByUserId(userId) >= 3) {
            throw new IllegalArgumentException("Card limit exceeded (max 3).");
        }

        Address userAddress = addressRepository.findByUserId(userId).orElse(null);
        emailService.sendProfileEditedEmail(user.getEmail());
        return saveCardForUser(user, userAddress, req);
    }


    public PaymentCard patchCard(Long userId, Long cardId, CardRequest req) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        PaymentCard pc = cardRepository.findById(cardId).orElseThrow(EntityNotFoundException::new);
        if (!pc.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Card not owned by user");

        if (req.expMonth() > 0) pc.setExpMonth((short) req.expMonth());
        if (req.expYear() > 0)  pc.setExpYear((short) req.expYear());

        Address usersAddress = addressRepository.findByUserId(userId).orElse(null);
        pc.setBillingAddress(usersAddress);
        emailService.sendProfileEditedEmail(user.getEmail());
        return cardRepository.save(pc);
    }

    public void deleteCard(Long userId, Long cardId) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        PaymentCard pc = cardRepository.findById(cardId).orElseThrow(EntityNotFoundException::new);
        if (!pc.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Card not owned by user");
        cardRepository.delete(pc);
        emailService.sendProfileEditedEmail(user.getEmail()); // Notify user their profile changed
    }

    //Helpers
        /**
     * Ensures the user has ONE address row.
     * If one exists, update it. If not, create one.
     * saveAndFlush forces the database to assign the address ID immediately
     * so cards can safely reference it right after.
     */
    private Address upsertSingleAddress(User user, AddressRequest req) {
        Address address = addressRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Address a = new Address();
                    a.setUser(user);
                    return a;
                });

        if (req.label() != null) address.setLabel(req.label());
        if (req.street() != null) address.setStreet(req.street());
        if (req.city() != null) address.setCity(req.city());
        if (req.state() != null) address.setState(req.state());
        if (req.postalCode() != null) address.setPostalCode(req.postalCode());
        if (req.country() != null) address.setCountry(req.country());
        if (address.getCountry() == null) address.setCountry("USA");

        // IMPORTANT: must FLUSH to ensure id exists for card FK use
        return addressRepository.saveAndFlush(address);
    }

    /**
     * Saves a card and links it to the user’s SINGLE address row.
     */
    private PaymentCard saveCardForUser(User user, Address userAddress, CardRequest req) {
        String pan = normalizePan(req.token());
        assertValidPan(pan);
        String last4 = pan.substring(pan.length() - 4);

        PaymentCard card = new PaymentCard();
        card.setUser(user);
        card.setBrand(req.brand());
        card.setToken(pan);
        card.setLast4(last4);
        card.setExpMonth((short) req.expMonth());
        card.setExpYear((short) req.expYear());

        
        card.setBillingAddress(userAddress);

        return cardRepository.save(card);
    }

    //Card Helpers
    private static String normalizePan(String s) {
        if (s == null) return null;
        return s.replaceAll("[^0-9]", ""); 
    }

    private static void assertValidPan(String pan) {
        if (pan == null) throw new IllegalArgumentException("Missing card number");
        if (!pan.matches("\\d{12,19}")) throw new IllegalArgumentException("Invalid card number length");
        if (!luhnOk(pan)) throw new IllegalArgumentException("Invalid card number (Luhn)");
    }

    private static boolean luhnOk(String num) {
        int sum = 0; boolean alt = false;
        for (int i = num.length() - 1; i >= 0; i--) {
            int n = num.charAt(i) - '0';
            if (alt) { n *= 2; if (n > 9) n -= 9; }
            sum += n; alt = !alt;
        }
        return sum % 10 == 0;
    }


}



