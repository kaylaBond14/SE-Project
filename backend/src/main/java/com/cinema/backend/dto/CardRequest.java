package com.cinema.backend.dto;

import jakarta.validation.constraints.*;

public record CardRequest(
       String brand,     // "VISA","MASTERCARD","AMEX","DISCOVER","OTHER"
       String last4,
        int expMonth,
        int expYear,
        Long billingAddrId,         // optional
        String token      // PAN
) {}

