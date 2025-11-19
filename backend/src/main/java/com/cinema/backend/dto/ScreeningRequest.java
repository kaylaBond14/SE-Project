
package com.cinema.backend.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record ScreeningRequest(
    @NotNull Long movieId,
    @NotNull Long hallId,
    @NotNull LocalDateTime startsAt,
    //@NotNull LocalDateTime endsAt,
    Boolean isCanceled // optional; defaults to false if null
) {}

