package com.cinema.backend.repository;

import com.cinema.backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    // "Now Playing" = movies with a release date on or before current date
    @Query("SELECT m FROM Movie m WHERE m.releaseDate <= CURRENT_DATE ORDER BY m.releaseDate DESC")
    List<Movie> findNowPlaying();

    // "Coming Soon" = movies with a release date after current date
    @Query("SELECT m FROM Movie m WHERE m.releaseDate > CURRENT_DATE ORDER BY m.releaseDate ASC")
    List<Movie> findComingSoon();

    // Search by title or synopsis (case insensitive, partial matches)
    @Query("""
       SELECT m FROM Movie m
       WHERE LOWER(m.title)    LIKE LOWER(CONCAT('%', :q, '%'))
          OR LOWER(m.synopsis) LIKE LOWER(CONCAT('%', :q, '%'))
       ORDER BY m.releaseDate DESC
       """)
    List<Movie> search(@Param("q") String q);

    /* ADVANCED FILTERING OPTIONS
       Filter by rating, runtime range, release date range
       Any parameter can be null (not applied)
    @Query("""
       SELECT m FROM Movie m
       WHERE (:rating    IS NULL OR m.rating = :rating)
         AND (:minRt     IS NULL OR m.runtimeMin >= :minRt)
         AND (:maxRt     IS NULL OR m.runtimeMin <= :maxRt)
         AND (:fromDate  IS NULL OR m.releaseDate >= :fromDate)
         AND (:toDate    IS NULL OR m.releaseDate <= :toDate)
       ORDER BY m.releaseDate DESC
       """)
    List<Movie> filter(@Param("rating") String rating,
                @Param("minRt") Integer minRuntime,
                   @Param("maxRt") Integer maxRuntime,
                   @Param("fromDate") LocalDate fromDate,
                   @Param("toDate") LocalDate toDate);
*/

    // Filter movies by genre (category title)
@Query("""
  SELECT m
  FROM Movie m
  WHERE (:genre IS NULL)
     OR EXISTS (
          SELECT 1
          FROM m.categories c
          WHERE LOWER(TRIM(c.title)) = LOWER(TRIM(:genre))
     )
  ORDER BY m.releaseDate DESC
""")
List<Movie> filterByGenre(@Param("genre") String genre);

// Distinct genres for dropdown
@Query("""
  select distinct c.title
  from Movie m
  join m.categories c
  where c.title is not null
  order by c.title
""")
List<String> distinctGenres();





}
