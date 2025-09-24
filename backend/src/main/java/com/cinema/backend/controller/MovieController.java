package com.cinema.backend.controller;

import com.cinema.backend.model.Movie;
import com.cinema.backend.repository.MovieRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin // allow calls from your React app
public class MovieController {

    private final MovieRepository movieRepo;

    public MovieController(MovieRepository movieRepo) {
        this.movieRepo = movieRepo;
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



}
