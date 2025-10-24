package com.cinema.backend.dto;

import jakarta.validation.Valid;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for user registration requests to validate input
 * and avoid changing fields.
 * Models what frntend send to /auth/register
 */
public record RegisterRequest (

    @Email @NotBlank String email,

    @NotBlank @Size(min=8) String password,

    @NotBlank String firstName,

    @NotBlank String lastName,

    String phone,

    Boolean promoOptIn,

    @Valid AddressRequest address,

    @Valid List<CardRequest> cards

) {}