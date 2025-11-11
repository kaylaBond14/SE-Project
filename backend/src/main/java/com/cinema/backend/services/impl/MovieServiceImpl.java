package com.cinema.backend.services.impl;

import com.cinema.backend.model.Movie;
import com.cinema.backend.model.Screening;
import com.cinema.backend.repository.MovieRepository;
import com.cinema.backend.repository.ScreeningRepository;
import com.cinema.backend.services.MovieService; 
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepo;
    private final ScreeningRepository screeningRepo;

    public MovieServiceImpl(MovieRepository movieRepo, ScreeningRepository screeningRepo) {
        this.movieRepo = movieRepo;
        this.screeningRepo = screeningRepo;
    }

    @Override
    public List<Movie> listMovies() {
        return movieRepo.findAll();
    }

    @Override
    public Optional<Movie> getMovie(Long movieId) {
        return movieRepo.findById(movieId);
    }

    @Override
    public List<Screening> listShowtimes(Long movieId, LocalDate date) {
        LocalDate d = (date == null) ? LocalDate.now() : date;
        LocalDateTime start = d.atStartOfDay();
        LocalDateTime end = d.plusDays(1).atStartOfDay();
        return screeningRepo.findForMovieOnDate(movieId, start, end);
    }

    @Override
    public List<Movie> listNowPlaying() {
        return movieRepo.findNowPlaying();
    }

    @Override
    public List<Movie> listComingSoon() {
        return movieRepo.findComingSoon();
    }

    @Override
    public List<Movie> search(String query) {
        String q = (query == null) ? "" : query.trim();
        if (q.isEmpty()) return List.of();
        return movieRepo.search(q);
    }

    @Override
    public List<Movie> filterByGenre(String genre) {
        String g = (genre == null || genre.isBlank()) ? null : genre.trim();
        return movieRepo.filterByGenre(g);
    }

    @Override
    public List<String> distinctGenres() {
        return movieRepo.distinctGenres();
    }

    @Override
    public Movie save(Movie movie) {
        return movieRepo.save(movie);
    }

    
}
