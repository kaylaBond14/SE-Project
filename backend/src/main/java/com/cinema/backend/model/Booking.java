package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "bookings",
    indexes = {
        @Index(name = "idx_bookings_user", columnList = "user_id"),
        @Index(name = "idx_bookings_screening", columnList = "screening_id"),
        @Index(name = "idx_bookings_created", columnList = "created_at")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "UK_booking_number", columnNames = "booking_number")
    }
)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "screening_id", nullable = false)
    private Long screeningId;

    @Column(name = "booking_number", nullable = false, length = 12, unique = true)
    private String bookingNumber;

    @Column(name = "payment_card_id")
    private Long paymentCardId; 

    @Column(name = "promotion_id")
    private Long promotionId; 

    @Column(name = "subtotal_cost", nullable = false)
    private Integer subtotalCost; 

    @Column(name = "fees_cost", nullable = false)
    private Integer feesCost; 

    @Column(name = "tax_cost", nullable = false)
    private Integer taxCost; 

    @Column(name = "discount_amount", nullable = false)
    private Integer discountAmount = 0; 

    @Column(name = "total_cost", nullable = false)
    private Integer totalCost; 

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "ENUM('PENDING','CONFIRMED','CANCELED','REFUNDED')")
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "payment_ref", length = 100)
    private String paymentRef; 

    @Column(name = "refund_deadline")
    private LocalDateTime refundDeadline; 
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }            

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getScreeningId() { return screeningId; }
    public void setScreeningId(Long screeningId) { this.screeningId = screeningId; }

    public String getBookingNumber() { return bookingNumber; }
    public void setBookingNumber(String bookingNumber) { this.bookingNumber = bookingNumber; }

    public Long getPaymentCardId() { return paymentCardId; }
    public void setPaymentCardId(Long paymentCardId) { this.paymentCardId = paymentCardId; }

    public Long getPromotionId() { return promotionId; }
    public void setPromotionId(Long promotionId) { this.promotionId = promotionId; }

    public Integer getSubtotalCost() { return subtotalCost; }
    public void setSubtotalCost(Integer subtotalCost) { this.subtotalCost = subtotalCost; }

    public Integer getFeesCost() { return feesCost; }
    public void setFeesCost(Integer feesCost) { this.feesCost = feesCost; }

    public Integer getTaxCost() { return taxCost; }
    public void setTaxCost(Integer taxCost) { this.taxCost = taxCost; }

    public Integer getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Integer discountAmount) { this.discountAmount = discountAmount; }

    public Integer getTotalCost() { return totalCost; }
    public void setTotalCost(Integer totalCost) { this.totalCost = totalCost; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }

    public LocalDateTime getRefundDeadline() { return refundDeadline; }
    public void setRefundDeadline(LocalDateTime refundDeadline) { this.refundDeadline = refundDeadline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
}
