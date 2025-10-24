package com.cinema.backend.dto;

import jakarta.validation.constraints.*;

public record CardRequest(
        @NotBlank String brand,     // "VISA","MASTERCARD","AMEX","DISCOVER","OTHER"
        @Pattern(regexp = "\\d{4}") String last4,
        @Min(1) @Max(12) int expMonth,
        @Min(2024) int expYear,
        Long billingAddrId,         // optional
        @NotBlank String token      // PSP token
) {}

