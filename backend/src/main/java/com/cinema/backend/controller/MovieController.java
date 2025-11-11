package com.cinema.backend.controller;

import com.cinema.backend.model.Movie;
import com.cinema.backend.services.MovieService;
import org.springframework.web.bind.annotation.*;
import com.cinema.backend.model.Screening;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin 
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> listMovies() {
        return movieService.listMovies();
    }

    @GetMapping("/now-playing")
    public List<Movie> listNowPlaying() {
        return movieService.listNowPlaying();
    }

    @GetMapping("/coming-soon")
    public List<Movie> listComingSoon() {
        return movieService.listComingSoon();
    }

    @GetMapping("/search")
    public List<Movie> search(@RequestParam String query) {
        return movieService.search(query);
    }

    @GetMapping("/filter")
    public List<Movie> filterByGenre(@RequestParam String genre) {
        return movieService.filterByGenre(genre);
    }

    @GetMapping("/genres")
    public List<String> distinctGenres() {
        return movieService.distinctGenres();
    }

    @GetMapping("/{movieId}")
    public Movie getMovie(@PathVariable Long movieId) { 
        return movieService.getMovie(movieId)
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Movie not found"));
    }

    @GetMapping("/{movieId}/showtimes")
    public List<Screening> listShowtimes(   
        @PathVariable Long movieId,
        @RequestParam(name = "date", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return movieService.listShowtimes(movieId, 
            (date == null) ? LocalDate.now() : date);
    }
}

    

