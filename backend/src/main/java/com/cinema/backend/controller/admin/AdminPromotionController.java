package com.cinema.backend.controller.admin;

import com.cinema.backend.dto.CreatePromotionRequest;
import com.cinema.backend.dto.PromotionResponse;
import com.cinema.backend.model.Promotion;
import com.cinema.backend.model.User;
import com.cinema.backend.services.EmailService;
import com.cinema.backend.services.PromotionService;
import com.cinema.backend.services.UserService;
import com.cinema.backend.repository.PromotionRepository;
import com.cinema.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
@CrossOrigin
public class AdminPromotionController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final PromotionService promoService;
    private final PromotionRepository promoRepo;

    public AdminPromotionController(PromotionService s, 
                                    PromotionRepository r) { 
        this.promoService = s; 
        this.promoRepo = r; }

    @PostMapping
    public ResponseEntity<PromotionResponse> create(@Valid @RequestBody CreatePromotionRequest req) {
        Promotion promo = new Promotion();
        promo.setCode(req.code());
        promo.setDiscountType(DiscountType.PERCENT);
        promo.setDiscountValue(req.discountValue());
        promo.setStartsOn(req.startsOn());
        promo.setEndsOn(req.endsOn());

        //Non-frontend fields
        promo.setDescription(null);
        promo.setMinPurchaseAmount(0);
        promo.setMaxUses(null);
        promo.setCurrentUses(0);
        promo.setActive(true);

        promoService.validateFields(promo);
        Promotion saved = promoRepo.save(promo);

        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @GetMapping
    public List<Promotion> list() {
        return promoRepo.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<String> send(@PathVariable Long id ) {
        Promotion promo = promoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promotion not found"));

        List<User> users = userRepository.findAll();
        for (User u : users) {
            if (u.isPromoOptIn() == true) {
                emailService.sendPromotionEmail(
                    u.getEmail(), 
                    promo.getCode(),
                    promo.getDiscountValue(),
                    promo.getStartsOn(), 
                    promo.getEndsOn()
                );
            }
        }
        return ResponseEntity.accepted().body("Queued send for promotion " + id);
    }


    //Convert DTO
    private PromotionResponse toDto(Promotion p) {
        return new PromotionResponse(
            p.getId(),
            p.getCode(),
            p.getDiscountValue(),
            p.getStartsOn(),
            p.getEndsOn()
        );
    }
}
