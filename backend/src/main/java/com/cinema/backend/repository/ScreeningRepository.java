package com.cinema.backend.repository;

import com.cinema.backend.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {

    @Query("""
           SELECT s FROM Screening s
           WHERE s.movieId = :movieId
             AND s.isCanceled = false
             AND s.startsAt >= :startOfDay
             AND s.startsAt <  :endOfDay
           ORDER BY s.startsAt ASC
           """)
    List<Screening> findForMovieOnDate(@Param("movieId") Long movieId,
                                       @Param("startOfDay") LocalDateTime startOfDay,
                                       @Param("endOfDay") LocalDateTime endOfDay);
}
