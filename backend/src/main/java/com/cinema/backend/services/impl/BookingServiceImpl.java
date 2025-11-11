package com.cinema.backend.services.impl;

import com.cinema.backend.model.*;
import com.cinema.backend.repository.*;
import com.cinema.backend.services.BookingService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepo;
    private final TicketRepository ticketRepo;
    private final SeatRepository seatRepo;
    private final ScreeningRepository screeningRepo;

    public BookingServiceImpl(BookingRepository bookingRepo,
                              TicketRepository ticketRepo,
                              SeatRepository seatRepo,
                              ScreeningRepository screeningRepo) {
        this.bookingRepo = bookingRepo;
        this.ticketRepo = ticketRepo;
        this.seatRepo = seatRepo;
        this.screeningRepo = screeningRepo;
    }

    @Override
    @Transactional
    public Booking startBooking(Long userId,
                                Long screeningId,
                                List<TicketRequest> tickets) {
        if (userId == null || screeningId == null) {
            throw new IllegalArgumentException("userId and screeningId are required");
        }
        if (tickets == null || tickets.isEmpty()) {
            throw new IllegalArgumentException("At least one ticket is required");
        }

        screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));

        int subtotal = tickets.stream()
                .mapToInt(tr -> {
                    if (tr == null || tr.age == null || tr.priceCents < 0) {
                        throw new IllegalArgumentException("Invalid ticket request");
                    }
                    return tr.priceCents;
                })
                .sum();

        Booking b = new Booking();
        b.setUserId(userId);
        b.setScreeningId(screeningId);
        b.setBookingNumber(generateRef(12));
        b.setSubtotalCost(subtotal);
        b.setFeesCost(0);    // FIX LATER FOR PAYMENT
        b.setTaxCost(0);
        b.setDiscountAmount(0);
        b.setTotalCost(subtotal);
        b.setStatus(BookingStatus.PENDING);

        b = bookingRepo.save(b);

        for (TicketRequest tr : tickets) {
            Ticket t = new Ticket();
            t.setBookingId(b.getId());
            t.setTicketNumber(generateRef(14));
            t.setAgeClassification(tr.age);
            t.setPriceCost(tr.priceCents);
            t.setScreeningId(screeningId); 
            ticketRepo.save(t);
        }

        return b;
    }

    @Override
    @Transactional
    public void assignSeats(Long bookingId, List<Long> seatIds) {
        if (bookingId == null) throw new IllegalArgumentException("bookingId is required");
        if (seatIds == null || seatIds.isEmpty()) {
            throw new IllegalArgumentException("Seat list cannot be empty");
        }

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        List<Ticket> tickets = ticketRepo.findByBookingId(bookingId);
        if (tickets.isEmpty()) {
            throw new IllegalStateException("No tickets exist for this booking");
        }
        if (tickets.size() != seatIds.size()) {
            throw new IllegalArgumentException("Seat count must match ticket count (tickets=" +
                    tickets.size() + ", seats=" + seatIds.size() + ")");
        }

        Long screeningId = tickets.get(0).getScreeningId();
        
        boolean sameScreening = tickets.stream().allMatch(t -> Objects.equals(t.getScreeningId(), screeningId));
        if (!sameScreening) throw new IllegalStateException("Tickets belong to different screenings");

        Screening screening = screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));
        Long hallId = screening.getHall().getId();

        // Validate seats exist and belong to the same hall
        List<Seat> chosen = seatRepo.findAllById(seatIds);
        if (chosen.size() != seatIds.size()) {
            // find which are missing for clearer error
            Set<Long> foundIds = chosen.stream().map(Seat::getId).collect(Collectors.toSet());
            List<Long> missing = seatIds.stream().filter(id -> !foundIds.contains(id)).toList();
            throw new IllegalArgumentException("Seats not found: " + missing);
        }
        boolean sameHall = chosen.stream().allMatch(seat -> Objects.equals(seat.getHall().getId(), hallId));
        if (!sameHall) {
            throw new IllegalArgumentException("All selected seats must be in hall " + hallId);
        }

        // Assign seats
        for (int i = 0; i < tickets.size(); i++) {
            Ticket t = tickets.get(i);
            Long seatId = seatIds.get(i);

            if (ticketRepo.existsByScreeningIdAndSeatId(screeningId, seatId)) {
                throw new IllegalStateException("Seat already taken: " + seatId);
            }

            try {
                t.setSeatId(seatId);
                ticketRepo.saveAndFlush(t); 
            } catch (DataIntegrityViolationException ex) {
                throw new IllegalStateException("One or more selected seats have just been taken. Please refresh.", ex);
            }
        }
    }

    @Override
    @Transactional
    public void confirmBooking(Long bookingId) {
        Booking b = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        List<Ticket> tickets = ticketRepo.findByBookingId(bookingId);
        if (tickets.isEmpty()) {
            throw new IllegalStateException("Cannot confirm: no tickets in booking");
        }
        boolean allHaveSeats = tickets.stream().allMatch(t -> t.getSeatId() != null);
        if (!allHaveSeats) {
            throw new IllegalStateException("Cannot confirm: all tickets must have seats assigned");
        }

        b.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(b);
    }

    private String generateRef(int length) {
        String raw = java.util.UUID.randomUUID().toString().replace("-", "").toUpperCase();
        return raw.substring(0, Math.min(length, raw.length()));
    }
}
