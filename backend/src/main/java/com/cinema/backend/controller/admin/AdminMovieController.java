package com.cinema.backend.controller.admin;

import com.cinema.backend.dto.CreateMovieRequest;
import com.cinema.backend.model.Movie;
import com.cinema.backend.repository.CategoryRepository;
import com.cinema.backend.services.MovieService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api/admin/movies")
@CrossOrigin
public class AdminMovieController {

    private final MovieService movieService;
    private final CategoryRepository categoryRepo;

    public AdminMovieController(MovieService movieService,
                                CategoryRepository categoryRepo) {
        this.movieService = movieService;
        this.categoryRepo = categoryRepo;
    }

    // POST /api/admin/movies
    @PostMapping
    public ResponseEntity<Movie> create(@Valid @RequestBody CreateMovieRequest req) {
        Movie m = new Movie();
        m.setTitle(req.getTitle());
        m.setSynopsis(req.getSynopsis());
        m.setRatingId(req.getRatingId());
        m.setTrailerUrl(req.getTrailerUrl());
        m.setPosterUrl(req.getPosterUrl());
        m.setRuntimeMin(req.getRuntimeMin());
        m.setReleaseDate(req.getReleaseDate());

        //Add genres
        var cats = new HashSet<>(categoryRepo.findAllById(req.getCategoryIds()));
        if (cats.size() != req.getCategoryIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more categories not found");
        }

        m.setCategories(cats);

        Movie saved = movieService.save(m);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Movie> listMovies() {
        return movieService.listMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable Long id) {
        return movieService.getMovie(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
    }
    
}
