package com.cinema.backend.controller;

import com.cinema.backend.model.Movie;
import com.cinema.backend.repository.MovieRepository;
import org.springframework.web.bind.annotation.*;
import com.cinema.backend.model.Screening;
import com.cinema.backend.repository.ScreeningRepository;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin 
public class MovieController {

    private final MovieRepository movieRepo;
    private final ScreeningRepository screeningRepo;

    public MovieController(MovieRepository movieRepo, ScreeningRepository screeningRepo) {
        this.movieRepo = movieRepo;
        this.screeningRepo = screeningRepo;
    }

    @GetMapping
    public List<Movie> getAll() {
        return movieRepo.findAll();
    }

    // GET /api/movies/now-playing
    @GetMapping("/now-playing")
    public List<Movie> getNowPlaying() {
        return movieRepo.findNowPlaying();
    }

    // GET /api/movies/coming-soon
    @GetMapping("/coming-soon")
    public List<Movie> getComingSoon() {
        return movieRepo.findComingSoon();
    }

    // GET /api/movies/search
    @GetMapping("/search")
    public List<Movie> search(@RequestParam("q") String q) {
        String term = q == null ? "" : q.trim();
            if (term.isEmpty()) return List.of(); //empty term returns empty list
                return movieRepo.search(term);
    }

    // GET /api/movies/{id}
    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieRepo.findById(id)
        .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
            org.springframework.http.HttpStatus.NOT_FOUND, "Movie not found"));
    }

    // GET /api/movies/{id}/showtimes?date=YYYY-MM-DD
    @GetMapping("/{id}/showtimes")
    public List<Screening> getShowtimesForMovieOnDate(
        @PathVariable Long id,
        @RequestParam(name = "date", required = false) String date
    ) {
        java.time.LocalDate d;
        if (date == null || date.isBlank()) {
            d = java.time.LocalDate.now();
        } else {
            try {
                d = java.time.LocalDate.parse(date); // expects YYYY-MM-DD
            } catch (java.time.format.DateTimeParseException e) {
                throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Invalid date format. Use YYYY-MM-DD."
                );
            }
    }

    java.time.LocalDateTime start = d.atStartOfDay();
    java.time.LocalDateTime end = d.plusDays(1).atStartOfDay();
    return screeningRepo.findForMovieOnDateWithHall(id, start, end);
}

/* ADVANCED FILTERING OPTIONS
    @GetMapping("/filter")
    public List<Movie> filter(
        @RequestParam(required = false) String rating,
        @RequestParam(required = false) Integer minRuntime,
        @RequestParam(required = false) Integer maxRuntime,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return movieRepo.filter(
            (rating == null || rating.isBlank()) ? null : rating.trim(),
            minRuntime,
            maxRuntime,
            from,
            to
        );
    }
*/
    // GET /api/movies/filter?genre=GenreName
    @GetMapping("/filter")
    public List<Movie> filterByGenre(@RequestParam(required = false) String genre) {
        String g = (genre == null || genre.isBlank()) ? null : genre.trim();
        return movieRepo.filterByGenre(g);
    }

    @GetMapping("/genres")
    public List<String> genres() {
        return movieRepo.distinctGenres();
    }

    @GetMapping(value = "/{id}/showtimes", params = "!date")
    public List<Screening> getFutureShowtimes(@PathVariable Long id) {
        return screeningRepo.findFutureForMovieWithHall(id, java.time.LocalDateTime.now());
    }

    
}

    


    

