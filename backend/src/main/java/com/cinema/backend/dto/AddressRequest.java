package com.cinema.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        String label,
        @NotBlank String street,
        @NotBlank String city,
        @NotBlank String state,
        String postalCode,
        String country
) {}
