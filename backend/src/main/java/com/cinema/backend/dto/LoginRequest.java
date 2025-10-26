package com.cinema.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * minimal payload frontend sends to /auth/login
 */
public class LoginRequest {

    @Email @NotBlank
    public String email;

    @NotBlank
    public String password;
}