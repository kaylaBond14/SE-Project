package com.cinema.backend.services;

import com.cinema.backend.model.User;
import com.cinema.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cinema.backend.dto.*;
import com.cinema.backend.factory.UserFactory;
//import com.cinema.backend.model.Address;
import com.cinema.backend.model.HomeAddress;
import com.cinema.backend.model.BillingAddress;
import com.cinema.backend.model.PaymentCard;
import com.cinema.backend.model.UserStatus;
import com.cinema.backend.model.UserType;
//import com.cinema.backend.repository.AddressRepository;
import com.cinema.backend.repository.HomeAddressRepository;
import com.cinema.backend.repository.BillingAddressRepository;
import com.cinema.backend.repository.PaymentCardRepository;
import com.cinema.backend.repository.UserStatusRepository; 
import com.cinema.backend.repository.UserTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
//import com.cinema.backend.services.EmailService;
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
    //private final AddressRepository addressRepository;
    private final HomeAddressRepository homeAddressRepository;
    private final BillingAddressRepository billingAddressRepository;
    private final PaymentCardRepository cardRepository;
    private final UserStatusRepository statusRepository;
    private final UserTypeRepository typeRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserFactory factory;


    public UserService(
                UserRepository users, 
                PasswordEncoder passwordEncoder,
                UserRepository userRepository,
                //AddressRepository addressRepository,
                HomeAddressRepository homeAddressRepository,
                BillingAddressRepository billingAddressRepository,
                PaymentCardRepository cardRepository,
                UserStatusRepository statusRepository,
                UserTypeRepository typeRepository
                ) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        //this.addressRepository = addressRepository;
        this.homeAddressRepository = homeAddressRepository;
        this.billingAddressRepository = billingAddressRepository;
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

    @Transactional
    public void setStatus(Long userId, String statusName) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        UserStatus status = statusRepository.findByStatusName(statusName)
            .orElseThrow(() -> new IllegalStateException("Status not found: " + statusName));

        user.setStatus(status);
        userRepository.save(user);
    }

    /**
     * Parial update of user basics
     */
    public User updateBasics(Long id, String firstName, String lastName, String phone, Boolean promoOptIn) {
        User user = getById(id);

        // Save the user's current info to check if any changes are made afterwards
        String oldFirstName = user.getFirstName();
        String oldLastName = user.getLastName();
        String oldPhone = user.getPhone();
        Boolean oldPromoOptIn = user.isPromoOptIn();

        boolean basicsUpdated = false; // Used to determine if a "profile edited" email is sent
        if (firstName != null && !firstName.isBlank()) {
            user.setFirstName(firstName);
            if (oldFirstName.compareTo(firstName) != 0) basicsUpdated = true;
        }
        if (lastName != null && !lastName.isBlank()) {
            user.setLastName(lastName);
            if (oldLastName.compareTo(lastName) != 0) basicsUpdated = true;
        }
        if (phone != null) {
            user.setPhone(phone);
            if (oldPhone.compareTo(phone) != 0) basicsUpdated = true;
        }
        if (promoOptIn != null) {
            user.setPromoOptIn(promoOptIn);
            if (oldPromoOptIn.equals(promoOptIn) == false) basicsUpdated = true;
        }

        if (basicsUpdated == true) {
            emailService.sendUpdatedBasicsEmail(user.getEmail()); // Notify user their profile changed
        }
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
        emailService.sendPasswordChangedEmail(user.getEmail()); // Notify user their profile changed
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
        return factory.createUser(req);
        /*
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

            
                //pc.setBillingAddress(createAddress(u.getId(), c.addressReq()));
                

                /*
                if (c.billingAddrId() != null) {
                    addressRepository.findById(c.billingAddrId()).ifPresent(addr -> {
                        if (!addr.getUser().getId().equals(u.getId())) {
                            throw new IllegalArgumentException("Billing address does not belong to user");
                        }
                        pc.setBillingAddress(addr);
                    });
                } else {
                    // optional: auto-use the user's single address if one exists
                    addressRepository.findByUserId(u.getId()).ifPresent(pc::setBillingAddress);
                }
                // Put multi-line comment ender back here

                cardRepository.save(pc);
            }
        }

        // Send verification email
        String verificationToken = JwtTokenUtil.generateToken(u.getEmail());
        u.setVerificationToken(verificationToken);
        emailService.sendVerificationEmail(u.getEmail(), verificationToken);

        return u;
        */
    }

    // Address ops (1 per user)
    //UPDATED WITH HOME ADDRESS
    public HomeAddress getHomeAddress(Long userId) {
        return homeAddressRepository.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("No home address"));
    }

    public HomeAddress createOrReplaceHomeAddress(Long userId, AddressRequest req) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        HomeAddress h = homeAddressRepository.findByUserId(userId).orElseGet(() -> {
            HomeAddress x = new HomeAddress();
            x.setUser(user);
            x.setLabel(req.label() == null ? "home" : req.label());
            return x;
        });
        h.setStreet(req.street());
        h.setCity(req.city());
        h.setState(req.state());
        h.setPostalCode(req.postalCode());
        h.setCountry((req.country() == null || req.country().isBlank()) ? "USA" : req.country());
        emailService.sendUpdatedAddressEmail(user.getEmail());
        return homeAddressRepository.save(h);
}

    public HomeAddress patchHomeAddress(Long userId, Long homeId, AddressRequest req) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        HomeAddress a = homeAddressRepository.findById(homeId).orElseThrow(EntityNotFoundException::new);
        if (!a.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Address not owned by user");

        // Save the user's current info to check if any changes are made afterwards
        String oldLabel = a.getLabel();
        String oldStreet = a.getStreet();
        String oldCity = a.getCity();
        String oldState = a.getState();
        String oldPostalCode = a.getPostalCode();
        String oldCountry = a.getCountry();

        boolean addressUpdated = false; // Used to determine if a "profile edited" email is sent
        if (req.label() != null) {
            a.setLabel(req.label());
            if (oldLabel.compareTo(req.label()) != 0) addressUpdated = true;
        }
        if (req.street() != null) {
            a.setStreet(req.street());
            if (oldStreet.compareTo(req.street()) != 0) addressUpdated = true;
        }
        if (req.city() != null) {
            a.setCity(req.city());
            if (oldCity.compareTo(req.city()) != 0) addressUpdated = true;
        }
        if (req.state() != null) {
            a.setState(req.state());
            if (oldState.compareTo(req.state()) != 0) addressUpdated = true;
        }
        if (req.postalCode() != null) {
            a.setPostalCode(req.postalCode());
            if (oldPostalCode.compareTo(req.postalCode()) != 0) addressUpdated = true;
        }
        if (req.country() != null) {
            a.setCountry(req.country());
            if (oldCountry.compareTo(req.country()) != 0) addressUpdated = true;
        }

        if (addressUpdated == true) {
            emailService.sendUpdatedAddressEmail(user.getEmail()); // Notify user their profile changed
        }
        return homeAddressRepository.save(a);
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

        // choose billing input: req.addressReq() or user's saved home
        Addr billingFields = (req.addressReq() != null) ? normalize(req.addressReq())
                            : homeAddressRepository.findByUserId(userId).map(this::normalize).orElse(null);

        if (billingFields == null) {
            throw new IllegalArgumentException("Billing address required (or set a home address to reuse).");
        }

        //String pan = normalizePan(req.token());
        //assertValidPan(pan);
        //String last4 = pan.substring(pan.length() - 4);

        BillingAddress billing = findOrCreateBillingAddress(userId, billingFields);

        PaymentCard card = new PaymentCard();
        card.setUser(user);
        card.setBrand(req.brand());
        card.setToken(req.token());//card.setToken(pan);
        card.setLast4(req.token().substring(req.token().length() - 4));//card.setLast4(last4);
        card.setExpMonth((short) req.expMonth());
        card.setExpYear((short) req.expYear());
        card.setBillingAddress(billing);

        emailService.sendAddedCardEmail(user.getEmail()); //Still sends when error b/c checks moved to CryptoProxy
        return cardRepository.save(card);
    }


    public PaymentCard patchCard(Long userId, Long cardId, CardRequest req) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        PaymentCard pc = cardRepository.findById(cardId).orElseThrow(EntityNotFoundException::new);
        if (!pc.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Card not owned by user");

        if (req.expMonth() > 0) pc.setExpMonth((short) req.expMonth());
        if (req.expYear() > 0)  pc.setExpYear((short) req.expYear());

        if (req.addressReq() != null) {
            Addr billingFields = normalize(req.addressReq());
            BillingAddress billing = findOrCreateBillingAddress(userId, billingFields);
            pc.setBillingAddress(billing);
        }
        //emailService.sendUpdatedCardEmail(user.getEmail());
        return cardRepository.save(pc);
    }

    public void deleteCard(Long userId, Long cardId) {
        var user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        PaymentCard pc = cardRepository.findById(cardId).orElseThrow(EntityNotFoundException::new);
        if (!pc.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Card not owned by user");
        cardRepository.delete(pc);
        emailService.sendDeletedCardEmail(user.getEmail()); // Notify user their profile changed
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
    private boolean same(Addr a, Addr b) {
        if (a == null || b == null) return false;
        return a.street().equalsIgnoreCase(b.street())
            && a.city().equalsIgnoreCase(b.city())
            && a.state().equalsIgnoreCase(b.state())
            && a.postal().equalsIgnoreCase(b.postal())
            && a.country().equalsIgnoreCase(b.country());
    }
    


    private static boolean eq(String a, String b) {
        return a != null && b != null && a.trim().equalsIgnoreCase(b.trim());
    }   
    /** 
    private static boolean addressesEqual(AddressRequest a, AddressRequest b) {
        if (a == null || b == null) return false;
        return eq(a.street(), b.street())
        && eq(a.city(), b.city())
        && eq(a.state(), b.state())
        && eq(a.postalCode(), b.postalCode())
        && eq(a.country() == null ? "USA" : a.country(),
              b.country() == null ? "USA" : b.country());
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

    /**
     * Saves a card and links it to the user’s SINGLE address row.
     
    private PaymentCard saveCardForUser(User user, homeAddress homeAddress, CardRequest req) {
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
        */

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

    /**private static boolean luhnOk(String num) {
        int sum = 0; boolean alt = false;
        for (int i = num.length() - 1; i >= 0; i--) {
            int n = num.charAt(i) - '0';
            if (alt) { n *= 2; if (n > 9) n -= 9; }
            sum += n; alt = !alt;
        }
        return sum % 10 == 0;
    }
        */


}



