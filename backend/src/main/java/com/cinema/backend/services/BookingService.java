package com.cinema.backend.services;

import com.cinema.backend.model.Booking;
import com.cinema.backend.model.TicketAgeClassification;

import java.util.List;

public interface BookingService {

    Booking startBooking(Long userId,
                         Long screeningId,
                         List<TicketRequest> tickets);

    void assignSeats(Long bookingId, List<Long> seatIds);

    void confirmBooking(Long bookingId);

    //DTO HERE
    class TicketRequest {
        public TicketAgeClassification age;
        public int priceCents;

        public TicketRequest() {}
        public TicketRequest(TicketAgeClassification age, int priceCents) {
            this.age = age; this.priceCents = priceCents;
        }
    }
}
