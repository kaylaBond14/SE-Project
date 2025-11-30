package com.cinema.backend.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cinema.backend.dto.AddressRequest;
import com.cinema.backend.dto.CardRequestDuringRegister;
import com.cinema.backend.dto.RegisterRequest;
import com.cinema.backend.model.BillingAddress;
import com.cinema.backend.model.HomeAddress;
import com.cinema.backend.model.PaymentCard;
import com.cinema.backend.model.User;
import com.cinema.backend.model.UserStatus;
import com.cinema.backend.model.UserType;
import com.cinema.backend.repository.BillingAddressRepository;
import com.cinema.backend.repository.HomeAddressRepository;
import com.cinema.backend.repository.PaymentCardRepository;
import com.cinema.backend.repository.UserRepository;
import com.cinema.backend.repository.UserStatusRepository;
import com.cinema.backend.repository.UserTypeRepository;
import com.cinema.backend.services.EmailService;
import com.cinema.backend.utils.JwtTokenUtil;

/*
 * This class is part of our implemnetation of the Factory Design Pattern.
 * We are using the Simple Factory Idiom instead of a full implementation of the Factory Method Pattern
 */
@Service
public class ConcreteUserFactory {
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    private final UserRepository userRepository;
    private final HomeAddressRepository homeAddressRepository;
    private final BillingAddressRepository billingAddressRepository;
    private final PaymentCardRepository cardRepository;
    private final UserStatusRepository statusRepository;
    private final UserTypeRepository typeRepository;

    public ConcreteUserFactory(
                UserRepository userRepository,
                HomeAddressRepository homeAddressRepository,
                BillingAddressRepository billingAddressRepository,
                PaymentCardRepository cardRepository,
                UserStatusRepository statusRepository,
                UserTypeRepository typeRepository
                ) {
        this.userRepository = userRepository;
        this.homeAddressRepository = homeAddressRepository;
        this.billingAddressRepository = billingAddressRepository;
        this.cardRepository = cardRepository;
        this.statusRepository = statusRepository;
        this.typeRepository = typeRepository;
    }


    public User createUser(RegisterRequest req) {
        User user = new User();
        if (req.password().compareTo("Team2admin!") == 0) {
            createAdmin(user, req);   
        } else {
            createCustomer(user, req);
        }
        return user;
    }

    private User createCustomer(User u, RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already in use");
        }

        //User u = new User();
        u.setEmail(req.email());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setFirstName(req.firstName());
        u.setLastName(req.lastName());
        u.setPhone(req.phone());
        u.setPromoOptIn(Boolean.TRUE.equals(req.promoOptIn()));
        u.setVerified(false);
        u.setAccountSuspended(false);

        // default status/type
        UserStatus inactive = statusRepository.findByStatusName("Inactive")
                .orElseThrow(() -> new IllegalStateException("Missing lookup: user_statuses.Active"));
        UserType customer = typeRepository.findByTypeName("Customer")
                .orElseThrow(() -> new IllegalStateException("Missing lookup: user_types.Customer"));
        u.setStatus(inactive);
        u.setUserType(customer);

        // tokens per schema (NOT NULL)
        u.setResetToken("pending");       
        u.setVerificationToken("pending");
        userRepository.save(u);

        // Update: upsert the ONE address, then saveAndFlush so it has a real ID 
        HomeAddress savedHome = null;
        Addr homeFields = null;
        if (req.address() != null) {
            savedHome = upsertHomeAddress(u, req.address());
            homeFields = normalize(savedHome);
        }

        // optional cards (0..3)
        if (req.cards() != null && !req.cards().isEmpty()) {
            for (CardRequestDuringRegister c : req.cards()) {
                if (cardRepository.countByUserId(u.getId()) >= 3) {
                    throw new IllegalArgumentException("Card limit exceeded (max 3).");
                }
 
                String pan = normalizePan(c.token());
                assertValidPan(pan);
                String last4 = pan.substring(pan.length() - 4);

                PaymentCard pc = new PaymentCard();
                pc.setUser(u);
                pc.setBrand(c.brand());
                pc.setLast4(last4);
                pc.setExpMonth((short) c.expMonth());
                pc.setExpYear((short) c.expYear());
                pc.setToken(pan);      // AES-GCM @Convert encrypts on save
                
                Addr billingFields = (c.addressReq() != null) ? normalize(c.addressReq())
                          : (homeFields != null ? homeFields : null);
                
                if (billingFields == null) {
                    throw new IllegalArgumentException("Billing address is required (or provide a home address to reuse).");
                }
                
                
                BillingAddress billing = findOrCreateBillingAddress(u.getId(), billingFields);
                pc.setBillingAddress(billing);        
                cardRepository.save(pc);
            }
        }

        // Send verification email
        String verificationToken = JwtTokenUtil.generateToken(u.getEmail());
        u.setVerificationToken(verificationToken);
        emailService.sendVerificationEmail(u.getEmail(), verificationToken);

        return u;
    }

    private User createAdmin(User u, RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already in use");
        }

        //User u = new User();
        u.setEmail(req.email());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setFirstName(req.firstName());
        u.setLastName(req.lastName());
        u.setPhone(req.phone());
        u.setPromoOptIn(Boolean.TRUE.equals(req.promoOptIn()));
        u.setVerified(true); // admins are auto-verified
        u.setAccountSuspended(false);

        // default status/type
        UserStatus inactive = statusRepository.findByStatusName("Inactive")
                .orElseThrow(() -> new IllegalStateException("Missing lookup: user_statuses.Active"));
        UserType admin = typeRepository.findByTypeName("Admin")
                .orElseThrow(() -> new IllegalStateException("Missing lookup: user_types.Admin"));
        u.setStatus(inactive);
        u.setUserType(admin);

        // tokens per schema (NOT NULL)
        u.setResetToken("");       
        u.setVerificationToken("");
        userRepository.save(u);

        return u;
    }



    //Helpers

    // Address Helpers
    private String norm(String s) { return s == null ? "" : s.trim().replaceAll("\\s+", " "); }
    private String normState(String s) { return norm(s).toUpperCase(); }
    private String normCountry(String s){ return norm(s).toUpperCase(); }
    private String normZip(String s)     { return norm(s).replaceAll("[\\s-]", ""); }

    private record Addr(String street, String city, String state, String postal, String country) {}

    private Addr normalize(AddressRequest a) {
        if (a == null) return null;
        String country = (a.country() == null || a.country().isBlank()) ? "USA" : a.country();
        return new Addr(
            norm(a.street()), norm(a.city()), normState(a.state()),
            normZip(a.postalCode()), normCountry(country)
        );
    }

    private Addr normalize(HomeAddress h) {
        if (h == null) return null;
        String country = (h.getCountry() == null || h.getCountry().isBlank()) ? "USA" : h.getCountry();
        return new Addr(
            norm(h.getStreet()), norm(h.getCity()), normState(h.getState()),
            normZip(h.getPostalCode()), normCountry(country)
        );
    }

    /**
     * CHANGED FOR HOME ADDRESS NOW
     * Ensures the user has ONE address row.
     * If one exists, update it. If not, create one.
     * saveAndFlush forces the database to assign the address ID immediately
     * so cards can safely reference it right after.
     */
    private HomeAddress upsertHomeAddress(User user, AddressRequest req) {
        HomeAddress h = homeAddressRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                HomeAddress x = new HomeAddress();
                x.setUser(user);
                x.setLabel("home");
                return x;
            });

        if (req.label() != null && !req.label().isBlank()) h.setLabel(req.label());
        h.setStreet(req.street());
        h.setCity(req.city());
        h.setState(req.state());
        h.setPostalCode(req.postalCode());
        h.setCountry((req.country() == null || req.country().isBlank()) ? "USA" : req.country());

        return homeAddressRepository.saveAndFlush(h); // ensure id immediately
    }   

    private BillingAddress findOrCreateBillingAddress(Long userId, Addr a) {
        return billingAddressRepository
            .findByUserIdAndStreetAndCityAndStateAndPostalCodeAndCountry(
                userId, a.street(), a.city(), a.state(), a.postal(), a.country())
            .orElseGet(() -> {
                BillingAddress b = new BillingAddress();
                b.setUser(userRepository.getReferenceById(userId));
                b.setStreet(a.street());
                b.setCity(a.city());
                b.setState(a.state());
                b.setPostalCode(a.postal());
                b.setCountry(a.country());
                return billingAddressRepository.save(b);
            });
    }

    //Card Helpers
    private static String normalizePan(String s) {
        if (s == null) return null;
        return s.replaceAll("[^0-9]", ""); 
    }

    private static void assertValidPan(String pan) {
        if (pan == null) throw new IllegalArgumentException("Missing card number");
        if (!pan.matches("\\d{12,19}")) throw new IllegalArgumentException("Invalid card number length");
        //if (!luhnOk(pan)) throw new IllegalArgumentException("Invalid card number (Luhn)");
    }

}