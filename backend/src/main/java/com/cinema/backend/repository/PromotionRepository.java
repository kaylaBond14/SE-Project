package com.cinema.backend.repository;

import com.cinema.backend.model.Promotion;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    //Find active promo by code
Optional<Promotion> findFirstByCodeIgnoreCaseAndActiveIsTrue(String code);

//Find active promo valid for today
@Query("""
        SELECT p FROM Promotion p
        WHERE LOWER(p.code) = LOWER(:code)
          AND p.active = TRUE
          AND p.startsOn <= :today
          AND p.endsOn >= :today
        """)
Optional<Promotion> findValidByCodeOnDate(@Param("code") String code,
                                         @Param("today") LocalDate today);


//Increment currentUses by 1 in database
@Transactional
@Modifying
@Query("UPDATE Promotion p SET p.currentUses = p.currentUses + 1 WHERE p.id = :id")
int incrementCurrentUses(@Param("id") Long id);
    

              





}

   