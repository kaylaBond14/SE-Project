package com.cinema.backend.controller;

import com.cinema.backend.dto.PromotionValidationResponse;
import com.cinema.backend.model.Promotion;
import com.cinema.backend.services.PromotionService;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    // CHANGED to /api/promotions/apply
    @PostMapping("/apply")
    public ResponseEntity<Void> apply(@RequestParam Long bookingId,
                                      @RequestParam String code) {
        promotionService.applyToBooking(bookingId, code);
        return ResponseEntity.noContent().build();
    }

     // validate promotion code
    @GetMapping("/{code}")
    public ResponseEntity<PromotionValidationResponse> validatePromotion(@PathVariable String code) {
        Optional<Promotion> promo = promotionService.findValidByCodeOnDate(code, LocalDate.now());
        
        if (promo.isPresent()) {
            Promotion p = promo.get();
            
            // Check usage limit
            if (p.getMaxUses() != null && p.getCurrentUses() >= p.getMaxUses()) {
                return ResponseEntity.ok(new PromotionValidationResponse(
                    false,
                    code,
                    null,
                    null,
                    "Promotion usage limit reached"
                ));
            }
            
            return ResponseEntity.ok(new PromotionValidationResponse(
                true,
                p.getCode(),
                p.getDiscountValue(),
                p.getDiscountType(),
                "Valid promotion code"
            ));
        }
        
        return ResponseEntity.ok(new PromotionValidationResponse(
            false,
            code,
            null,
            null,
            "Invalid or expired promotion code"
        ));
    }







    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> badReq(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> conflict(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}
