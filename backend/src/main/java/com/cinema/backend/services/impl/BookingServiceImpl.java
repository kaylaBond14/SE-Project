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

        Screening screening = screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));

        if (screening.isCanceled()) {
            throw new IllegalStateException("Cannot book canceled screening");
        }

        if (screening.getAvailableSeats() != null && screening.getAvailableSeats() < tickets.size()) {
            throw new IllegalStateException("Not enough seats available for screening");
        }

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
        b.setFeesCost(0);    
        b.setTaxCost(0);
        b.setDiscountAmount(0);
        b.setTotalCost(subtotal);
        b.setStatus(BookingStatus.PENDING);

        b = bookingRepo.save(b);

        return b;
    }

    @Override
    @Transactional
    public void assignSeats(Long bookingId, 
                        List<TicketWithSeatRequest> ticketsWithSeats) {
        if (bookingId == null) throw new IllegalArgumentException("bookingId is required");
        if (ticketsWithSeats == null || ticketsWithSeats.isEmpty()) {
            throw new IllegalArgumentException("Ticket and seat list cannot be empty");
        }

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Can only assign seats to pending bookings");
        }

        int selectionsTotal = ticketsWithSeats.stream()
            .mapToInt(t -> t.priceCents)
            .sum();

        if (selectionsTotal != booking.getSubtotalCost()) {
        throw new IllegalArgumentException(
            "Seat selections don't match the original booking. " +
            "Expected total: " + booking.getSubtotalCost() + " cents, " +
            "but got: " + selectionsTotal + " cents. " +
            "Please select the correct number of seats with matching ticket types."
        );
    }

        

        List<Ticket> existingTickets = ticketRepo.findByBookingId(bookingId);
        if (!existingTickets.isEmpty()) {
            throw new IllegalStateException("Seats already assigned to this booking");
        }

        Long screeningId = booking.getScreeningId();
        
        Screening screening = screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));
        Long hallId = screening.getHall().getId();


        List<Long> seatIds = ticketsWithSeats.stream()
                .map(t -> t.seatId)
                .toList();

        List<Seat> chosen = seatRepo.findAllById(seatIds);
        if (chosen.size() != seatIds.size()) {
            Set<Long> foundIds = chosen.stream().map(Seat::getId).collect(Collectors.toSet());
            List<Long> missing = seatIds.stream().filter(id -> !foundIds.contains(id)).toList();
            throw new IllegalArgumentException("Seats not found: " + missing);
        }
        
        boolean sameHall = chosen.stream().allMatch(seat -> Objects.equals(seat.getHall().getId(), hallId));
        if (!sameHall) {
            throw new IllegalArgumentException("All selected seats must be in hall " + hallId);
        }

        Set<Long> uniqueSeats = new HashSet<>(seatIds);
        if (uniqueSeats.size() != seatIds.size()) {
            throw new IllegalArgumentException("Cannot select the same seat multiple times");
        }

        for (Long seatId : seatIds) {
            if (ticketRepo.existsByScreeningIdAndSeatId(screeningId, seatId)) {
                throw new IllegalStateException("Seat already taken: " + seatId);
            }
        }

        for (TicketWithSeatRequest tws : ticketsWithSeats) {
            Ticket ticket = new Ticket();
            ticket.setBookingId(bookingId);
            ticket.setScreeningId(screeningId);
            ticket.setTicketNumber(generateRef(14));
            ticket.setAgeClassification(tws.age);
            ticket.setPriceCost(tws.priceCents);
            ticket.setSeatId(tws.seatId); 
            
            try {
                ticketRepo.saveAndFlush(ticket);
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
