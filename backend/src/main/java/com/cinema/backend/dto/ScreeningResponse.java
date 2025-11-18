package com.cinema.backend.dto;

import java.time.LocalDateTime;

public record ScreeningResponse(
    Long id,
    Long movieId,
    String movieTitle,
    Long hallId,
    String hallName,
    LocalDateTime startsAt,
    LocalDateTime endsAt,
    boolean isCanceled,
    Integer availableSeats
) {}
