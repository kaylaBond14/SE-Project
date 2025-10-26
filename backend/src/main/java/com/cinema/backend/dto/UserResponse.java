package com.cinema.backend.dto;

import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String email,
    String firstName,
    String lastName,
    String phone,
    String statusName,
    String userTypeName,
    boolean isVerified,
    boolean accountSuspended,
    boolean promoOptIn,
    LocalDateTime createdAt,  
    LocalDateTime updatedAt
) {}
