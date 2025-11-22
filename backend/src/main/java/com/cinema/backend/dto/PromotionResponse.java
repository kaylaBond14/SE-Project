package com.cinema.backend.dto;

public record PromotionResponse(
    Long id,
    String code,
    Integer discountValue,
    LocalDate startsOn,
    LocalDate endsOn
) {}