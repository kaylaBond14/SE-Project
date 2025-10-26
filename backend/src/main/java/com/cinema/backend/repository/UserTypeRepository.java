package com.cinema.backend.repository;

import com.cinema.backend.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserTypeRepository extends JpaRepository<UserType, Short> {

    // Look up user type row by name
    Optional<UserType> findByTypeName(String typeName);
}