package com.cinema.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import com.cinema.backend.crypto.CryptoProxy;
import com.cinema.backend.crypto.CryptoStringConverter;

@Entity
@Table(name = "payment_cards")
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "brand", nullable = false, length = 20)
    private String brand; // VISA, MASTERCARD, AMEX, DISCOVER, OTHER

    @Pattern(regexp = "\\d{4}")
    @Column(name = "last4", nullable = false, length = 4)
    private String last4;

    @Min(1)
    @Max(12)
    @Column(name = "exp_month", nullable = false)
    private short expMonth;

    @Min(2000) @Max(2100)
    @Column(name = "exp_year", nullable = false)
    private short expYear;

    @Convert(converter = CryptoProxy.class) // Changed from CryptoStringConverter to CryptoProxy
    @Column(name = "token", nullable = false, length = 255)
    private String token;

    // Each card belongs to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optional billing address reference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billing_address_id")
    private BillingAddress billingAddress;

    public PaymentCard() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getLast4() { return last4; }
    public void setLast4(String last4) { this.last4 = last4; }

    public short getExpMonth() { return expMonth; }
    public void setExpMonth(short expMonth) { this.expMonth = expMonth; }

    public short getExpYear() { return expYear; }
    public void setExpYear(short expYear) { this.expYear = expYear; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BillingAddress getBillingAddress() { return billingAddress; }
    public void setBillingAddress(BillingAddress billingAddress) { this.billingAddress = billingAddress; }
}

