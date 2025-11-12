package com.cinema.backend.controller.admin;

import com.cinema.backend.dto.ScreeningRequest;
import com.cinema.backend.dto.ScreeningResponse;
import com.cinema.backend.services.ScreeningService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/screenings")
@CrossOrigin
public class AdminScreeningController {

    private final ScreeningService screeningService;

    public AdminScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    // Create screening (DTO in, DTO out)
    @PostMapping
    public ResponseEntity<ScreeningResponse> create(@Valid @RequestBody ScreeningRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(screeningService.create(req));
    }

    // List screenings (DTOs, fetch-joined via service to avoid lazy errors)
    @GetMapping
    public List<ScreeningResponse> list() {
        return screeningService.listAll();
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

