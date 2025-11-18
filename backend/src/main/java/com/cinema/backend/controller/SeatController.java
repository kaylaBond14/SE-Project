package com.cinema.backend.controller;

import com.cinema.backend.dto.SeatAvailability;
import com.cinema.backend.dto.SeatView;
import com.cinema.backend.model.Booking;
import com.cinema.backend.repository.BookingRepository;
import com.cinema.backend.services.BookingService;
import com.cinema.backend.repository.SeatRepository;
import com.cinema.backend.services.SeatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin 
public class SeatController {

    private final SeatService seatService;
    private final BookingRepository bookingRepo;
    private final SeatRepository seatRepo;
    private final BookingService bookingService;

    public SeatController(SeatService seatService,
                          BookingRepository bookingRepo,
                          SeatRepository seatRepo,
                          BookingService bookingService) {
        this.seatService = seatService;
        this.bookingRepo = bookingRepo;
        this.seatRepo = seatRepo;
        this.bookingService = bookingService;
    }

    // GET /api/screenings/{screeningId}/seatmap
    @GetMapping("/api/screenings/{screeningId}/seatmap")
    public List<SeatAvailability> seatMap(@PathVariable Long screeningId) {
        return seatService.getSeatMap(screeningId);
    }

    // Get seat map by booking - might not need this
    // GET /api/bookings/{bookingId}/seatmap
    @GetMapping("/api/bookings/{bookingId}/seatmap")
    public List<SeatAvailability> seatMapForBooking(@PathVariable Long bookingId) {
        Booking b = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Booking not found"));
        return seatService.getSeatMap(b.getScreeningId());
    }

    //Admin setup
    //GET /api/halls/{hallId}/seats
    @GetMapping("/api/halls/{hallId}/seats")
    public Object seatsInHall(@PathVariable Long hallId) {
        return seatRepo.findByHall_IdOrderByRowNumAscColNumAsc(hallId)
                .stream()
                .map(seat -> new SeatView(
                        seat.getId(),
                        seat.getRowNum(),
                        seat.getColNum(),
                        seat.getLabel(),
                        hallId
                ))
                .toList();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}

