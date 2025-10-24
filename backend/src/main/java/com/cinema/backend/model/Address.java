package com.cinema.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(
    name = "addresses",
    uniqueConstraints = @UniqueConstraint(columnNames = "user_id", name = "uq_one_address_per_user")
)
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    private String postalCode;
    private String country;

    // Each address belongs to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Address() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
