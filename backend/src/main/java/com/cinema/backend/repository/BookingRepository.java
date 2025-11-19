package com.cinema.backend.repository;

import com.cinema.backend.model.Booking;
import com.cinema.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingNumber(String bookingNumber);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByScreeningId(Long screeningId);

    long countByScreeningIdAndStatus(Long screeningId, BookingStatus status);
}
