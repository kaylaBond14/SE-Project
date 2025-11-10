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
              AND s.startsAt < :endTime
              AND s.endsAt   > :startTime
            """)
      boolean existsOverlap(@Param("hallId") Long hallId,
                            @Param("startTime") LocalDateTime startTime,
                            @Param("endTime") LocalDateTime endTime);

      
      List<Screening> findByMovieIdAndStartsAtAfterOrderByStartsAtAsc(Long movieId, LocalDateTime from);
}
