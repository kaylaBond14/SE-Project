package com.cinema.backend.repository;

import com.cinema.backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    // "Now Playing" = movies with a release date on or before current date
    @Query("SELECT m FROM Movie m WHERE m.releaseDate <= CURRENT_DATE ORDER BY m.releaseDate DESC")
    List<Movie> findNowPlaying();

    // "Coming Soon" = movies with a release date after current date
    @Query("SELECT m FROM Movie m WHERE m.releaseDate > CURRENT_DATE ORDER BY m.releaseDate ASC")
    List<Movie> findComingSoon();

}
