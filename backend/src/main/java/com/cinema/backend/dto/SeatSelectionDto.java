package com.cinema.backend.dto;

import com.cinema.backend.model.TicketAgeClassification;

public class SeatSelectionDto {
    private Long seatId;
    private TicketAgeClassification age;
    private int priceCents;

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public TicketAgeClassification getAge() {
        return age;
    }

    public void setAge(TicketAgeClassification age) {
        this.age = age;
    }

    public int getPriceCents() {
        return priceCents;
    }

    public void setPriceCents(int priceCents) {
        this.priceCents = priceCents;
    }
}
