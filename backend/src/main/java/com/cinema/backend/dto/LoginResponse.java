package com.cinema.backend.dto;

public record LoginResponse(
        Long userId,
        String email,
        String token
) {}