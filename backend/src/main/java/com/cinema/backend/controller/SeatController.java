package com.cinema.backend.controller;

import com.cinema.backend.dto.SeatAvailability;
import com.cinema.backend.services.SeatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screenings")
@CrossOrigin 
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // GET /api/screenings/{id}/seatmap
    @GetMapping("/{screeningId}/seatmap")
    public List<SeatAvailability> seatMap(@PathVariable Long screeningId) {
        return seatService.getSeatMap(screeningId);
    }

    // POST /api/screenings/{id}/reserve
    @PostMapping("/{screeningId}/reserve")
    public ResponseEntity<Void> reserve(@PathVariable Long screeningId,
                                        @RequestBody ReserveSeatsRequest body) {
        seatService.reserveSeats(body.getBookingId(), screeningId, body.getSeatIds());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    public static class ReserveSeatsRequest {
        private Long bookingId;
        private List<Long> seatIds;

        public Long getBookingId() { return bookingId; }
        public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

        public List<Long> getSeatIds() { return seatIds; }
        public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }
    }
}

