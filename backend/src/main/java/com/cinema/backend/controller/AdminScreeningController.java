package com.cinema.backend.controller;

import com.cinema.backend.model.Screening;
import com.cinema.backend.services.ScreeningService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/screenings")
@CrossOrigin
public class AdminScreeningController {

    private final ScreeningService screeningService;

    public AdminScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    // Create a screening 
    @PostMapping
    public ResponseEntity<Screening> create(@RequestBody CreateScreeningRequest body) {
        Screening s = screeningService.createScreening(
                body.getMovieId(),
                body.getHallId(),
                body.getStartsAt(),
                body.getRuntimeMinutes());
        return ResponseEntity.status(HttpStatus.CREATED).body(s);
    }

    // DTO for creating a screening
    public static class CreateScreeningRequest {
        private Long movieId;
        private Long hallId;                  
        private LocalDateTime startsAt;
        private Integer runtimeMinutes; // optional

        public Long getMovieId() { return movieId; }
        public void setMovieId(Long movieId) { this.movieId = movieId; }
        public Long getHallId() { return hallId; }
        public void setHallId(Long hallId) { this.hallId = hallId; }
        public LocalDateTime getStartsAt() { return startsAt; }
        public void setStartsAt(LocalDateTime startsAt) { this.startsAt = startsAt; }
        public Integer getRuntimeMinutes() { return runtimeMinutes; }
        public void setRuntimeMinutes(Integer runtimeMinutes) { this.runtimeMinutes = runtimeMinutes; }
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
