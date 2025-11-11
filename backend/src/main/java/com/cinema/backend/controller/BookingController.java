package com.cinema.backend.controller;

import com.cinema.backend.model.Booking;
import com.cinema.backend.model.Ticket;
import com.cinema.backend.repository.TicketRepository;
import com.cinema.backend.services.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;
    private final TicketRepository ticketRepo;

    public BookingController(BookingService bookingService,
                             TicketRepository ticketRepo) {
        this.bookingService = bookingService;
        this.ticketRepo = ticketRepo;
    }

    // Start booking
    @PostMapping
    public ResponseEntity<Booking> start(@RequestBody StartBookingRequest body) {
        Booking b = bookingService.startBooking(
                body.getUserId(),
                body.getScreeningId(),
                body.getTickets()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(b);
    }

    // Assign seats to all tickets in the booking
    @PostMapping("/{bookingId}/assign-seats")
    public ResponseEntity<Void> assignSeats(@PathVariable Long bookingId,
                                            @RequestBody List<Long> seatIds) {
        bookingService.assignSeats(bookingId, seatIds);
        return ResponseEntity.noContent().build();
    }

    // Confirm booking (optional state change)
    @PostMapping("/{bookingId}/confirm")
    public ResponseEntity<Void> confirm(@PathVariable Long bookingId) {
        bookingService.confirmBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

    // fetch booking's tickets
    @GetMapping("/{bookingId}/tickets")
    public List<Ticket> tickets(@PathVariable Long bookingId) {
        return ticketRepo.findByBookingId(bookingId);
    }

    //DTOs
    public static class StartBookingRequest {
        private Long userId;
        private Long screeningId;
        private List<BookingService.TicketRequest> tickets;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getScreeningId() { return screeningId; }
        public void setScreeningId(Long screeningId) { this.screeningId = screeningId; }
        public List<BookingService.TicketRequest> getTickets() { return tickets; }
        public void setTickets(List<BookingService.TicketRequest> tickets) { this.tickets = tickets; }
    }

    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> badReq(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> conflict(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}
