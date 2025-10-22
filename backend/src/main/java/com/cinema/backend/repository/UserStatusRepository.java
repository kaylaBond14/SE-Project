package com.cinema.backend.repository;

import com.cinema.backend.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserStatusRepository extends JpaRepository<UserStatus, Short> {

    // Look up status row by name
    Optional<UserStatus> findByStatusName(String statusName);
}