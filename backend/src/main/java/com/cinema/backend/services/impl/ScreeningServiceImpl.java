package com.cinema.backend.services.impl;

import com.cinema.backend.model.Movie;
import com.cinema.backend.model.Hall;
import com.cinema.backend.model.Screening;
import com.cinema.backend.repository.HallRepository;
import com.cinema.backend.repository.MovieRepository;
import com.cinema.backend.repository.ScreeningRepository;
import com.cinema.backend.services.ScreeningService;
import com.cinema.backend.services.ScheduleConflictException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScreeningServiceImpl implements ScreeningService {

    private final ScreeningRepository screeningRepo;
    private final MovieRepository movieRepo;
    private final HallRepository hallRepo;

    public ScreeningServiceImpl(ScreeningRepository screeningRepo,
                                MovieRepository movieRepo,
                                HallRepository hallRepo) {
        this.screeningRepo = screeningRepo;
        this.movieRepo = movieRepo;
        this.hallRepo = hallRepo;
    }

    @Override
    @Transactional
    public Screening createScreening(Long movieId,
                                     Long hallId,
                                     LocalDateTime startTime,
                                     Integer runtimeMinutes) {

        if (movieId == null || hallId == null || startTime == null) {
            throw new IllegalArgumentException("movieId, hallId, and startTime are required");
        }

        int minutes = (runtimeMinutes != null)
                ? runtimeMinutes
                : movieRepo.findById(movieId)
                           .map(Movie::getRuntimeMin)
                           .orElseThrow(() ->
                               new IllegalArgumentException("Movie not found or runtime missing."));

        LocalDateTime endTime = startTime.plus(Duration.ofMinutes(minutes));

        boolean overlap = screeningRepo.existsOverlap(hallId, startTime, endTime);
        if (overlap) {
            throw new ScheduleConflictException(
                    "Schedule conflict in hall " + hallId + " for window " + startTime + " to " + endTime);
        }

        Hall hall = hallRepo.findById(hallId)
                .orElseThrow(() -> new IllegalArgumentException("Hall not found: " + hallId));

        Screening s = new Screening();
        s.setMovieId(movieId);
        s.setHall(hall);
        s.setStartsAt(startTime);
        s.setEndsAt(endTime);
        s.setCanceled(false);

        return screeningRepo.save(s);
    }

    @Override
    public List<Screening> getShowtimesForMovieOnDate(Long movieId, LocalDate date) {
        LocalDate d = (date == null) ? LocalDate.now() : date;
        LocalDateTime start = d.atStartOfDay();
        LocalDateTime end = d.plusDays(1).atStartOfDay();
        return screeningRepo.findForMovieOnDate(movieId, start, end);
    }
}

    