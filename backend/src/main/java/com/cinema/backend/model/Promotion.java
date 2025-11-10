package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "promotions",
    indexes = {
        @Index(name = "idx_promo_code_active", columnList = "code, active"),
        @Index(name = "idx_promo_dates", columnList = "starts_on, ends_on")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "UK_promotions_code", columnNames = "code")
    }
)

public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, length = 50, unique = true)
    private String code;

    @Column(name = "description", length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, columnDefinition = "ENUM('PERCENT','FIXED')")
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false)
    private Integer discountValue;

    @Column(name = "min_purchase_amount", nullable = false)
    private Integer minPurchaseAmount = 0;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(name = "current_uses", nullable = false)
    private Integer currentUses = 0;

    @Column(name = "starts_on", nullable = false)
    private LocalDate startsOn;

    @Column(name = "ends_on", nullable = false)
    private LocalDate endsOn;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    //Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public Integer getDiscountValue() { return discountValue; }
    public void setDiscountValue(Integer discountValue) { this.discountValue = discountValue; }

    public Integer getMinPurchaseAmount() { return minPurchaseAmount; }
    public void setMinPurchaseAmount(Integer minPurchaseAmount) { this.minPurchaseAmount = minPurchaseAmount; }

    public Integer getMaxUses() { return maxUses; }
    public void setMaxUses(Integer maxUses) { this.maxUses = maxUses; }

    public Integer getCurrentUses() { return currentUses; }
    public void setCurrentUses(Integer currentUses) { this.currentUses = currentUses; }

    public LocalDate getStartsOn() { return startsOn; }
    public void setStartsOn(LocalDate startsOn) { this.startsOn = startsOn; }

    public LocalDate getEndsOn() { return endsOn; }
    public void setEndsOn(LocalDate endsOn) { this.endsOn = endsOn; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; } 

    public java.time.LocalDateTime getCreatedAt() { return createdAt; } 
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; } 

    //Helpers MIGHT NOT NEED YET
    @Transient
    public boolean isWithinDate(LocalDate today) {
        return (today.isEqual(startsOn) || today.isAfter(startsOn)) &&
               (today.isEqual(endsOn) || today.isBefore(endsOn));
    }

    @Transient
    public boolean hasRemainingUses() {
        return maxUses == null || currentUses < maxUses;
    }



}
