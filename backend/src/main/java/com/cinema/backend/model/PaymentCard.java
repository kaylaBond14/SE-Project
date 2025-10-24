package com.cinema.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(
    name = "payment_cards",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "id"}, name = "uq_three_cards_per_user")
)
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String brand; // VISA, MASTERCARD, AMEX, DISCOVER, OTHER

    @Pattern(regexp = "\\d{4}")
    private String last4;

    private short expMonth;
    private short expYear;

    @NotBlank
    private String token; // token from payment provider, never raw PAN

    // Each card belongs to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optional billing address reference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billing_address_id")
    private Address billingAddress;

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

    public Address getBillingAddress() { return billingAddress; }
    public void setBillingAddress(Address billingAddress) { this.billingAddress = billingAddress; }
}

