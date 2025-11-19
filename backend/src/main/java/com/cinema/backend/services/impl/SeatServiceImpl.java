package com.cinema.backend.services.impl;

import com.cinema.backend.dto.SeatAvailability;
import com.cinema.backend.model.Booking;
import com.cinema.backend.model.Screening;
import com.cinema.backend.model.Seat;
import com.cinema.backend.model.Ticket;
import com.cinema.backend.repository.BookingRepository;
import com.cinema.backend.repository.ScreeningRepository;
import com.cinema.backend.repository.SeatRepository;
import com.cinema.backend.repository.TicketRepository;
import com.cinema.backend.services.SeatService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SeatServiceImpl implements SeatService {

    private final ScreeningRepository screeningRepo;
    private final SeatRepository seatRepo;
    private final TicketRepository ticketRepo;
    private final BookingRepository bookingRepo;

    public SeatServiceImpl(ScreeningRepository screeningRepo,
                           SeatRepository seatRepo,
                           TicketRepository ticketRepo,
                           BookingRepository bookingRepo) {
        this.screeningRepo = screeningRepo;
        this.seatRepo = seatRepo;
        this.ticketRepo = ticketRepo;
        this.bookingRepo = bookingRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeatAvailability> getSeatMap(Long screeningId) {
        Screening screening = screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));

        Long hallId = screening.getHall().getId();

        List<Seat> seats = seatRepo.findByHall_IdOrderByRowNumAscColNumAsc(hallId);

        Set<Long> reserved = new HashSet<>(ticketRepo.findReservedSeatIds(screeningId));

        return seats.stream()
                .map(seat -> new SeatAvailability(
                        seat.getId(),
                        seat.getRowNum(),
                        seat.getColNum(),
                        seat.getLabel(),                        
                        reserved.contains(seat.getId())
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void reserveSeats(Long bookingId, Long screeningId, List<Long> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new IllegalArgumentException("Seat list cannot be empty");
        }

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        if (!Objects.equals(booking.getScreeningId(), screeningId)) {
            throw new IllegalArgumentException("Booking does not belong to the provided screening");
        }

        List<Ticket> tickets = ticketRepo.findByBookingId(bookingId);
        if (tickets.size() != seatIds.size()) {
            throw new IllegalArgumentException("Seat count must match ticket count (tickets=" +
                    tickets.size() + ", seats=" + seatIds.size() + ")");
        }

        Screening screening = screeningRepo.findById(screeningId)
                .orElseThrow(() -> new IllegalArgumentException("Screening not found: " + screeningId));
        Long hallId = screening.getHall().getId();

        List<Seat> chosen = seatRepo.findAllById(seatIds);
        if (chosen.size() != seatIds.size()) {
            throw new IllegalArgumentException("One or more seats do not exist");
        }
        boolean sameHall = chosen.stream().allMatch(seat -> Objects.equals(seat.getHall().getId(), hallId));
        if (!sameHall) {
            throw new IllegalArgumentException("All selected seats must be in hall " + hallId);
        }

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
                throw new IllegalStateException(
                        "One or more selected seats have just been taken. Please refresh and retry.", ex);
            }
        }
    }
}






        
