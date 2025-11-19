package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "screenings",
    indexes = {
        @Index(name = "idx_screenings_starts_at", columnList = "starts_at"),
        @Index(name = "idx_screenings_movie_date", columnList = "movie_id, starts_at"),
        @Index(name = "idx_screenings_hall", columnList = "hall_id"),
        @Index(name = "idx_screenings_hall_time", columnList = "hall_id, starts_at, ends_at")
    },
    uniqueConstraints = @UniqueConstraint(name = "uq_hall_time", columnNames = {"hall_id", "starts_at"})
)
public class Screening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hall_id", nullable = false, foreignKey = @ForeignKey(name = "fk_scr_hall"))
    private Hall hall;

    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;

    @Column(name = "ends_at", nullable = false)
    private LocalDateTime endsAt;

    @Column(name = "is_canceled", nullable = false)
    private boolean isCanceled;

    @Column(name = "available_seats", insertable = false, updatable = false)
    private Integer availableSeats;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public Hall getHall() { return hall; }
    public void setHall(Hall hall) { this.hall = hall; }

    public LocalDateTime getStartsAt() { return startsAt; }
    public void setStartsAt(LocalDateTime startsAt) { this.startsAt = startsAt; }

    public LocalDateTime getEndsAt() { return endsAt; }
    public void setEndsAt(LocalDateTime endsAt) { this.endsAt = endsAt; }

    public boolean isCanceled() { return isCanceled; }
    public void setCanceled(boolean canceled) { isCanceled = canceled; }

    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
}

