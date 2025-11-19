package com.cinema.backend.services;

import com.cinema.backend.model.Screening;
import com.cinema.backend.dto.ScreeningRequest;
import com.cinema.backend.dto.ScreeningResponse;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface ScreeningService {

    Screening createScreening(Long movieId,
                              Long hallId,
                              LocalDateTime startTime,
                              Integer runtimeMinutes);

    List<Screening> getShowtimesForMovieOnDate(Long movieId, LocalDate date);

    ScreeningResponse create(ScreeningRequest req);

    List<ScreeningResponse> listAll();
    
}
