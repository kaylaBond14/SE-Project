package com.cinema.backend.repository;

import com.cinema.backend.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {

  boolean existsByHallIdAndStartsAt(Long hallId, LocalDateTime startsAt);

  //Overlap Checking screenings in the same hall
  @Query("""
            SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END
            FROM Screening s
            WHERE s.hall.id = :hallId
              AND s.isCanceled = FALSE
              AND s.startsAt < :endTime
              AND s.endsAt   > :startTime
            """)
      boolean existsOverlap(@Param("hallId") Long hallId,
                            @Param("startTime") LocalDateTime startTime,
                            @Param("endTime") LocalDateTime endTime);

      //upcoming showtimes for a movie after certain time
      List<Screening> findByMovieIdAndStartsAtAfterOrderByStartsAtAsc(Long movieId, LocalDateTime from);

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
