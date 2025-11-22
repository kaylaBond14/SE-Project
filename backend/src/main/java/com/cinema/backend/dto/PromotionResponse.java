package com.cinema.backend.dto;

import java.time.LocalDate;

public record PromotionResponse(
    Long id,
    String code,
    Integer discountValue,
    LocalDate startsOn,
    LocalDate endsOn
) {}