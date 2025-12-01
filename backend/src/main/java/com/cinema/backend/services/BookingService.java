package com.cinema.backend.services;

import com.cinema.backend.model.Booking;
import com.cinema.backend.dto.BookingHistoryResponse;
import com.cinema.backend.dto.CheckoutRequest;
import com.cinema.backend.dto.CheckoutResponse;
import com.cinema.backend.model.TicketAgeClassification;

import java.util.List;

public interface BookingService {

    Booking startBooking(Long userId,
                         Long screeningId,
                         List<TicketRequest> tickets);

    void assignSeats(Long bookingId, List<TicketWithSeatRequest> ticketsWithSeats);

    CheckoutResponse processCheckout(Long bookingId, CheckoutRequest request);

    List<BookingHistoryResponse> getOrderHistory(Long userId);

    
    class TicketRequest {
        public TicketAgeClassification age;
        public int priceCents;

        public TicketRequest() {}
        public TicketRequest(TicketAgeClassification age, int priceCents) {
            this.age = age; this.priceCents = priceCents;
        }
    }

    class TicketWithSeatRequest {
        public TicketAgeClassification age;
        public int priceCents;
        public Long seatId;

        public TicketWithSeatRequest() {}
        public TicketWithSeatRequest(TicketAgeClassification age, int priceCents, Long seatId) {
            this.age = age;
            this.priceCents = priceCents;
            this.seatId = seatId;
        }
    }
}
