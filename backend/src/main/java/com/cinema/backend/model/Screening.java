package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "screenings")
public class Screening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                        

    @Column(name = "movie_id", nullable = false)
    private Long movieId;                   

    @Column(name = "hall_id", nullable = false)
    private Integer hallId;                 

    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;         

    @Column(name = "ends_at", nullable = false)
    private LocalDateTime endsAt;           

    @Column(name = "is_canceled", nullable = false)
    private boolean isCanceled;             

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    public Integer getHallId() { return hallId; }
    public void setHallId(Integer hallId) { this.hallId = hallId; }
    public LocalDateTime getStartsAt() { return startsAt; }
    public void setStartsAt(LocalDateTime startsAt) { this.startsAt = startsAt; }
    public LocalDateTime getEndsAt() { return endsAt; }
    public void setEndsAt(LocalDateTime endsAt) { this.endsAt = endsAt; }
    public boolean isCanceled() { return isCanceled; }
    public void setCanceled(boolean canceled) { isCanceled = canceled; }
}
