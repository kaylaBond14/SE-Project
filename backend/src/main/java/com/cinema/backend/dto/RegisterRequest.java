package com.cinema.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for user registration requests to validate input
 * and avoid changing fields.
 * Models what frntend send to /auth/register
 */
public class RegisterRequest {

    @Email @NotBlank //must be valid and not empty
    private String email;

    //TODO
    @NotBlank @Size(min=8) //Secure?? check password qualificatons
    private String password;

    @NotBlank
    public String firstName;

    @NotBlank
    public String lastName;

    //OPTIONAl
    public Boolean promoOptIn;

}