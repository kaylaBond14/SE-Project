package com.cinema.backend.services;

import com.cinema.backend.model.Promotion;

import java.time.LocalDate;
import java.util.Optional;

public interface PromotionService {

    void validateFields(Promotion promo);

    Optional<Promotion> findValidByCodeOnDate(String code, LocalDate date);

    void applyToBooking(Long bookingId, String code);
    
}
