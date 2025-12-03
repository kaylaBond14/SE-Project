package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fees")
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "amount", nullable = false)
    private Integer amount; // in cents

    @Column(name = "effective_on", nullable = false)
    private LocalDate effectiveOn;

    @Column(name = "expires_on")
    private LocalDate expiresOn;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    public Fee() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }

    public LocalDate getEffectiveOn() { return effectiveOn; }
    public void setEffectiveOn(LocalDate effectiveOn) { this.effectiveOn = effectiveOn; }

    public LocalDate getExpiresOn() { return expiresOn; }
    public void setExpiresOn(LocalDate expiresOn) { this.expiresOn = expiresOn; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}