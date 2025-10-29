package com.cinema.backend.dto;

import jakarta.validation.constraints.NotNull;

public record LogoutRequest(
    @NotNull Long userId
) {}

