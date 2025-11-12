package com.cinema.backend.repository;

import com.cinema.backend.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {

    boolean existsByHall_IdAndStartsAt(Long hallId, LocalDateTime startsAt);

    List<Screening> findAllByHall_IdOrderByStartsAtAsc(Long hallId);
    
    List<Screening> findAllByMovieIdAndHall_IdOrderByStartsAtAsc(Long movieId, Long hallId);


    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END " +
           "FROM Screening s " +
           "WHERE s.hall.id = :hallId " +
           "AND s.isCanceled = false " +
           "AND s.startsAt < :endTime " +
           "AND s.endsAt > :startTime")
    boolean existsOverlap(@Param("hallId") Long hallId,
                          @Param("startTime") LocalDateTime startTime,
                          @Param("endTime") LocalDateTime endTime);

    List<Screening> findByMovieIdAndIsCanceledFalseAndStartsAtAfterOrderByStartsAtAsc(
            Long movieId, LocalDateTime from);

    @Query("SELECT s FROM Screening s " +
           "WHERE s.movieId = :movieId " +
           "AND s.isCanceled = false " +
           "AND s.startsAt >= :startOfDay " +
           "AND s.startsAt < :endOfDay " +
           "ORDER BY s.startsAt ASC")
    List<Screening> findForMovieOnDate(@Param("movieId") Long movieId,
                                       @Param("startOfDay") LocalDateTime startOfDay,
                                       @Param("endOfDay") LocalDateTime endOfDay);

      @Query("""
           select s
           from Screening s
           join fetch s.hall h
           order by s.startsAt
           """)
    List<Screening> findAllWithHall();           
    
       @Query("""
              select s
              from Screening s
              join fetch s.hall h
              where s.movieId = :movieId
              and s.isCanceled = false
              and s.startsAt >= :startOfDay
              and s.startsAt <  :endOfDay
              order by s.startsAt
              """)
      List<Screening> findForMovieOnDateWithHall(
              @Param("movieId") Long movieId,
              @Param("startOfDay") java.time.LocalDateTime startOfDay,
              @Param("endOfDay")   java.time.LocalDateTime endOfDay
       );

       @Query("""
       select s
       from Screening s
       join fetch s.hall h
       where s.movieId = :movieId
         and s.isCanceled = false
         and s.startsAt > :after
       order by s.startsAt
       """)
       List<Screening> findFutureForMovieWithHall(
              @Param("movieId") Long movieId,
              @Param("after")   java.time.LocalDateTime after
       );

}

