package com.cinema.backend.controller.admin;

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
    public ResponseEntity<Promotion> create(@RequestBody Promotion body) {
        promoService.validateFields(body);
        Promotion saved = promoRepo.save(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Promotion> list() {
        return promoRepo.findAll();
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<String> send(@PathVariable Long id ) {
        Promotion promo = promoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Promotion not found"));
        List<User> users = userRepository.findAll();
        for (User u : users) {
            if (u.isPromoOptIn() == true) {
                emailService.sendPromotionEmail(u.getEmail(), promo.getCode(), promo.getDiscountValue(),
                                                promo.getStartsOn(), promo.getEndsOn());
            }
        }
        return ResponseEntity.accepted().body("Queued send for promotion " + id);
    }


    
}
