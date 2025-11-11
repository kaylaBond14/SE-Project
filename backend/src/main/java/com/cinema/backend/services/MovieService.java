package com.cinema.backend.services;

import com.cinema.backend.model.Movie;
import com.cinema.backend.model.Screening;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MovieService {
    List<Movie> listMovies();
    Optional<Movie> getMovie(Long movieId);

    List<Screening> listShowtimes(Long movieId, LocalDate date);

    List<Movie> listNowPlaying();

    List<Movie> listComingSoon();

    List<Movie> search(String query);

    List<Movie> filterByGenre(String genre);

    List<String> distinctGenres();

    Movie save(Movie movie);
    
}
