package com.cinema.backend.repository;

import com.cinema.backend.model.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface FeeRepository extends JpaRepository<Fee, Long> {

    @Query("""
        SELECT f FROM Fee f 
        WHERE f.active = true 
        AND LOWER(f.name) = LOWER(:name)
        AND f.effectiveOn <= :date 
        AND (f.expiresOn IS NULL OR f.expiresOn >= :date)
        ORDER BY f.effectiveOn DESC
        """)
    Optional<Fee> findActiveFeeByName(@Param("name") String name, @Param("date") LocalDate date);
}
