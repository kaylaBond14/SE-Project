package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "tickets",
    indexes = {
        @Index(name = "idx_tickets_screening", columnList = "screening_id"),
        @Index(name = "idx_tickets_booking", columnList = "booking_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_seat_screening", columnNames = {"seat_id", "screening_id"})
    }
)
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "ticket_number", nullable = false, length = 14, unique = true)
    private String ticketNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "age_classification", nullable = false, columnDefinition = "ENUM('CHILD','ADULT','SENIOR')")
    private TicketAgeClassification ageClassification;

    @Column(name = "price_cost", nullable = false)
    private Integer priceCost; 

    @Column(name = "seat_id", nullable = false)
    private Long seatId;

    @Column(name = "screening_id", nullable = false)
    private Long screeningId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    //Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public TicketAgeClassification getAgeClassification() { return ageClassification; }
    public void setAgeClassification(TicketAgeClassification ageClassification) { this.ageClassification = ageClassification; }

    public Integer getPriceCost() { return priceCost; }
    public void setPriceCost(Integer priceCost) { this.priceCost = priceCost; }

    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public Long getScreeningId() { return screeningId; }
    public void setScreeningId(Long screeningId) { this.screeningId = screeningId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

