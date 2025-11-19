package com.cinema.backend.controller.admin;

import com.cinema.backend.model.Promotion;
import com.cinema.backend.services.PromotionService;
import com.cinema.backend.repository.PromotionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
@CrossOrigin
public class AdminPromotionController {

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
        return ResponseEntity.accepted().body("Queued send for promotion " + id);
    }


    
}
