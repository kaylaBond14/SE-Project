package com.cinema.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.backend.model.HomeAddress;

public interface HomeAddressRepository extends JpaRepository<HomeAddress, Long> {
    Optional<HomeAddress> findByUserId(Long userId);
}
