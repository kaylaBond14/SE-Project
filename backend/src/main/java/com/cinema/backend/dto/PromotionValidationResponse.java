package com.cinema.backend.dto;

import com.cinema.backend.model.DiscountType;

public record PromotionValidationResponse(
    boolean valid,
    String code,
    Integer discountValue,
    DiscountType discountType,
    String message
) {}