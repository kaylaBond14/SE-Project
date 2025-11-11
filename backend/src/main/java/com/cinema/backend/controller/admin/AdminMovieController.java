package com.cinema.backend.controller.admin;

import com.cinema.backend.model.Movie;
import com.cinema.backend.services.MovieService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/movies")
@CrossOrigin
public class AdminMovieController {

    private final MovieService movieService;

    public AdminMovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    //POST /api/admin/movies
    @PostMapping
    public ResponseEntity<Movie> create(@RequestBody Movie movie) {
        Movie saved = movieService.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Movie> listMovies() {
        return movieService.listMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable Long id) {
        return movieService.getMovie(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Movie not found"));
    }
    
}
