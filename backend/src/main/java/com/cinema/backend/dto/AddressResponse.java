package com.cinema.backend.dto;

public record AddressResponse(
        Long id, String label, String street, String city, String state, String postalCode, String country
) {}
