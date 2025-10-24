package com.cinema.backend.dto;

public record CardResponse(
        Long id, String brand, String last4, int expMonth, int expYear, Long billingAddrId
) {}

