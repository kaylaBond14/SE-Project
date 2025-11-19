package com.cinema.backend.services.impl;

import com.cinema.backend.model.Booking;
import com.cinema.backend.model.DiscountType;
import com.cinema.backend.model.Promotion;
import com.cinema.backend.repository.BookingRepository;
import com.cinema.backend.repository.PromotionRepository;
import com.cinema.backend.services.PromotionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promoRepo;
    private final BookingRepository bookingRepo;

    public PromotionServiceImpl(PromotionRepository promoRepo,
                                BookingRepository bookingRepo) {
        this.promoRepo = promoRepo;
        this.bookingRepo = bookingRepo;
    }

    @Override
    public void validateFields(Promotion p) {
        if (p == null) throw new IllegalArgumentException("Promotion must not be null");

        if (p.getCode() == null || p.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Promo code is required");
        }
        if (p.getCode().length() > 50) {
            throw new IllegalArgumentException("Promo code too long (max 50)");
        }

        if (p.getStartsOn() == null || p.getEndsOn() == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (p.getEndsOn().isBefore(p.getStartsOn())) {
            throw new IllegalArgumentException("End date must be on/after start date");
        }

        if (p.getDiscountType() == null) {
            throw new IllegalArgumentException("Discount type is required");
        }
        if (p.getDiscountValue() == null || p.getDiscountValue() <= 0) {
            throw new IllegalArgumentException("Discount value must be > 0");
        }
        if (p.getDiscountType() == DiscountType.PERCENT) {
            if (p.getDiscountValue() > 100) {
                throw new IllegalArgumentException("Percent discount cannot exceed 100%");
            }
        }

        if (p.getMaxUses() != null && p.getMaxUses() < 0) {
            throw new IllegalArgumentException("Max uses must be >= 0");
        }
        if (Boolean.FALSE.equals(p.isActive())) {
            // inactive promos can be saved but cannot be applied
        }
    }

    @Override
    public Optional<Promotion> findValidByCodeOnDate(String code, LocalDate onDate) {
        if (code == null || code.isBlank()) return Optional.empty();
        LocalDate today = (onDate == null) ? LocalDate.now() : onDate;
        return promoRepo.findValidByCodeOnDate(code.trim(), today);
    }

    @Override
    @Transactional
    public void applyToBooking(Long bookingId, String code) {
        if (bookingId == null) throw new IllegalArgumentException("bookingId is required");
        if (code == null || code.isBlank()) throw new IllegalArgumentException("Promo code is required");

        Booking b = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        Promotion promo = findValidByCodeOnDate(code, LocalDate.now())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or inactive promo code"));

        if (promo.getMaxUses() != null && promo.getCurrentUses() >= promo.getMaxUses()) {
            throw new IllegalStateException("Promo usage limit reached");
        }

        int subtotal = safe(b.getSubtotalCost());
        int fees     = safe(b.getFeesCost());
        int tax      = safe(b.getTaxCost());

        int discount = computeDiscountCents(subtotal, promo);
        discount = Math.max(0, Math.min(discount, subtotal));

        b.setPromotionId(promo.getId());
        b.setDiscountAmount(discount);
        b.setTotalCost(Math.max(0, subtotal + fees + tax - discount));
        bookingRepo.save(b);

        promoRepo.incrementCurrentUses(promo.getId());
    }

    private int computeDiscountCents(int subtotalCents, Promotion promo) {
        if (promo.getDiscountType() == DiscountType.PERCENT) {
            long d = Math.round(subtotalCents * (promo.getDiscountValue() / 100.0));
            return (int)Math.min(Integer.MAX_VALUE, d);
        } else {
            return promo.getDiscountValue();
        }
    }

    private int safe(Integer v) { return (v == null) ? 0 : v; }
}
