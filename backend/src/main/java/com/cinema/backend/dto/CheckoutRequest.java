package com.cinema.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CheckoutRequest(
    // Option 1: Use saved card
    Long savedCardId,
    
    // Option 2: Use new card (not saved to profile)
    @Valid NewCardInfo newCard,
    
    // Optional promotion code
    String promotionCode
) {
    public record NewCardInfo(
        @NotBlank String brand,
        @NotBlank String token,      // Card number (will be validated)
        @Pattern(regexp = "^\\d{4}$") String last4,
        @Min(1) @Max(12) int expMonth,
        @Min(2000) int expYear
    ) {}
}