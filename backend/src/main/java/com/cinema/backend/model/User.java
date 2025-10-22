package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// SHOULD NOT BE EMPTY

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(length=40)
    private String phone;

    @ManyToOne(optional = false)
    @JoinColumn(name = "status_id", nullable = false)
    private UserStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_type_id", nullable = false)
    private UserType userType;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Column(name = "account_suspended", nullable = false)
    private boolean accountSuspended = false;

    @Column(name = "promo_opt_in", nullable = false)
    private boolean promoOptIn = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public User() {}

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return password; }
    public void setPasswordHash(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }  

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }  

    public string getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean isVerified) { this.isVerified = isVerified; }

    public boolean isAccountSuspended() { return accountSuspended; }
    public void setAccountSuspended(boolean accountSuspended) { this.accountSuspended = accountSuspended; }

    public boolean isPromoOptIn() { return promoOptIn; }
    public void setPromoOptIn(boolean promoOptIn) { this.promoOptIn = promoOptIn; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 




