package com.cinema.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreatePromotionRequest (
    @NotBlank String code,
    @NotNull @Min(1) @Max(100) Integer discountValue,
    @NotNull LocalDate startsOn,
    @NotNull LocalDate endsOn
) {}
