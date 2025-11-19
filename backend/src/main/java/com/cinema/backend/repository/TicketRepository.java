package com.cinema.backend.repository;

import com.cinema.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    
    boolean existsByScreeningIdAndSeatId(Long screeningId, Long seatId);

    @Query("SELECT t.seatId FROM Ticket t WHERE t.screeningId = :screeningId")
    List<Long> findReservedSeatIds(@Param("screeningId") Long screeningId);

    List<Ticket> findByBookingId(Long bookingId);

    List<Ticket> findByScreeningId(Long screeningId);
}

