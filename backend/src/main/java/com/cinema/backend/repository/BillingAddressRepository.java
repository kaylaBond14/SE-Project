package com.cinema.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.backend.model.BillingAddress;

public interface BillingAddressRepository extends JpaRepository<BillingAddress, Long> {
    Optional<BillingAddress> findByUserIdAndStreetAndCityAndStateAndPostalCodeAndCountry(
        Long userId, String street, String city, String state, String postalCode, String country);
}
