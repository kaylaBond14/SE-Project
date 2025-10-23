package com.cinema.backend.services;

import com.cinema.backend.model.User;
import com.cinema.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Will call userRepository.findById()
// Will format or hde info before sending to controller
// So, hashing passwords before saving them.
@Service
@Transactional
public class UserService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
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
        //TODO: invalidate refresh tokens// seessins for user
        //TODO: enqueue: "password changed" email notif?
    }

    /**
     * Admin: suspend or unsuspend account
     */
    public void setSuspended(Long id, boolean suspend) {
        User user = getById(id);
        user.setAccountSuspended(suspend);
        users.save(user);
    }
}
