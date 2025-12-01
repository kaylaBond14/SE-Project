package com.cinema.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CheckoutResponse(
    String bookingNumber,
    String status,
    OrderSummary orderSummary,
    String message
) {
    public record OrderSummary(
        String movieTitle,
        LocalDateTime showtime,
        String hallName,
        List<String> seats,
        Integer subtotalCost,
        Integer feesCost,
        Integer taxCost,
        Integer discountAmount,
        Integer totalCost,
        String promotionCode
    ) {}
}
