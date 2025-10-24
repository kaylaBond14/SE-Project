package com.cinema.backend.repository;

import com.cinema.backend.model.PaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentCardRepository extends JpaRepository<PaymentCard, Long> {
    List<PaymentCard> findByUserId(Long userId);
    int countByUserId(Long userId);
}

