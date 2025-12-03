package com.cinema.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record BookingHistoryResponse(
    Long bookingId,
    String bookingNumber,
    String status,
    
    // Movie and Screening info
    Long movieId,
    String movieTitle,
    String moviePosterUrl,
    Integer movieRuntimeMin,
    LocalDateTime showtime,
    String hallName,
    boolean screeningCanceled,
    
    // Tickets
    List<TicketInfo> tickets,
    
    // Costs
    Integer subtotalCost,
    Integer feesCost,
    Integer taxCost,
    Integer discountAmount,
    Integer totalCost,
    
    // Promotion
    String promotionCode,
    
    // Timestamps
    LocalDateTime refundDeadline,
    LocalDateTime createdAt
) {
    public record TicketInfo(
        String ticketNumber,
        String ageClassification,
        Integer priceCost,
        String seatLabel
    ) {}
}