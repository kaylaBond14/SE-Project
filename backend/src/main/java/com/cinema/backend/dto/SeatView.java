package com.cinema.backend.dto;

public record SeatView(Long id, 
        int rowNumber, 
        int columnNumber, 
        String label, 
        Long hallId
) {}
