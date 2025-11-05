package com.cinema.backend.dto;

public record LoginResponse(
        Long userId,
        String email,
        String token,
        String role, //ADMIN OR CUSTOMER
        String status
) {}