package com.cinema.backend.controller;

import com.cinema.backend.dto.BookingHistoryResponse;
import com.cinema.backend.dto.CheckoutRequest;
import com.cinema.backend.dto.CheckoutResponse;
import com.cinema.backend.dto.SeatSelectionDto;
import com.cinema.backend.model.Booking;
import com.cinema.backend.model.Ticket;
import com.cinema.backend.repository.TicketRepository;
import com.cinema.backend.repository.BookingRepository;
import com.cinema.backend.services.BookingService;

import jakarta.validation.Valid;

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
    private final BookingRepository bookingRepo; //for applyPromo if want it here

    public BookingController(BookingService bookingService,
                             TicketRepository ticketRepo,
                             BookingRepository bookingRepo) {
        this.bookingService = bookingService;
        this.ticketRepo = ticketRepo;
        this.bookingRepo = bookingRepo;
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

    //Convert to ticket with Seat Request
    @PostMapping("/{bookingId}/assign-seats")
    public ResponseEntity<Void> assignSeats(@PathVariable Long bookingId,
                                            @RequestBody AssignSeatsRequest body) {
        List<BookingService.TicketWithSeatRequest> ticketsWithSeats = 
            body.getSelections().stream()
                .map(sel -> new BookingService.TicketWithSeatRequest(
                    sel.getAge(),
                    sel.getPriceCents(),
                    sel.getSeatId()
                ))
                .toList();
        
        bookingService.assignSeats(bookingId, ticketsWithSeats);
        return ResponseEntity.noContent().build();
    }

    //Checkout endpoint - handles payment, promotions, confirms booking
    //POST /api/bookings/{bookingId}/checkout
    @PostMapping("/{bookingId}/checkout")
    public ResponseEntity<CheckoutResponse> checkout(
            @PathVariable Long bookingId,
            @Valid @RequestBody CheckoutRequest request) {
        CheckoutResponse response = bookingService.processCheckout(bookingId, request);
        return ResponseEntity.ok(response);
    }

    //Get order history for user
    //GET /api/bookings/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingHistoryResponse>> getOrderHistory(@PathVariable Long userId) {
        List<BookingHistoryResponse> history = bookingService.getOrderHistory(userId);
        return ResponseEntity.ok(history);
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

    public static class ApplyPromotionRequest {
        private String code;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> badReq(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> conflict(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    public static class AssignSeatsRequest {
    private Long bookingId;
    private List<SeatSelectionDto> selections;
    
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    
    public List<SeatSelectionDto> getSelections() { return selections; }
    public void setSelections(List<SeatSelectionDto> selections) { 
        this.selections = selections; 
    }
}




}
