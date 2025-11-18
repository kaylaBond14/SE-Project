package com.cinema.backend.dto;



public record CardRequestDuringRegister(
       String brand,     // "VISA","MASTERCARD","AMEX","DISCOVER","OTHER"
       String last4,
        int expMonth,
        int expYear,
        AddressRequest addressReq,         // optional
        String token      // PAN
) {}