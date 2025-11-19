package com.cinema.backend.services;

import com.cinema.backend.dto.SeatAvailability;
import java.util.List;

public interface SeatService {
    List<SeatAvailability> getSeatMap(Long screeningId);

    void reserveSeats(Long bookingId, Long screeningId, List<Long> seatIds);
    
}
