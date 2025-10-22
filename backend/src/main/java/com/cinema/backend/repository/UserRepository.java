package com.cinema.backend.repository;

import com.cinema.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    //Check if a user exists by email for registration
    boolean existsByEmail(String email);
}

