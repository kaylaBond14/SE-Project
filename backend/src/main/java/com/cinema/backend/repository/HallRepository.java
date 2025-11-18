package com.cinema.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.backend.model.Hall;


public interface HallRepository extends JpaRepository<Hall, Long>{
    Optional<Hall> findByName(String name);
    boolean existsByName(String name);
 
}
