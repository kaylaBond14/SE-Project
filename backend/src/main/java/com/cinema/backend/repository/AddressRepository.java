package com.cinema.backend.repository;

import com.cinema.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByUserId(Long userId);
}

