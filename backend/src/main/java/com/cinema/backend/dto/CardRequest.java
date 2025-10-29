package com.cinema.backend.dto;

import jakarta.validation.constraints.*;

/**
 * Frontend must NOT send billing address IDs anymore.
 * billingSameAsHome enforces that billing address equals the user's single address row.
 * If null, treat as true in the service.
 */
public record CardRequest(
       @NotBlank String brand,     // "VISA","MASTERCARD","AMEX","DISCOVER","OTHER"
       @NotBlank String token,     // tokenized PAN from your PCI/tokenization layer
       @Pattern(regexp="^\\d{4}$") String last4,
       @Min(1) @Max(12) int expMonth,
       @Min(2000) int expYear,
       AddressRequest addressReq,
       Boolean billingSameAsHome 

) {}
