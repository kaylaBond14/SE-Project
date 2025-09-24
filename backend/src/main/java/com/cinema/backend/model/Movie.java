package com.cinema.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                    

    @Column(nullable = false)
    private String title;               

    @Column(columnDefinition = "TEXT")
    private String synopsis;            

    // DB has ENUM('G','PG','PG-13','R','NR') we'll keep it simple as string first
    private String rating;              // ENUM in DB -> String in app (fine for v1)

    @Column(name = "trailer_url")
    private String trailerUrl;          

    @Column(name = "poster_url")
    private String posterUrl;           

    @Column(name = "runtime_min")
    private Integer runtimeMin;         

    @Column(name = "release_date")
    private LocalDate releaseDate;      

    // These are auto-managed by MySQL defaults; mark as not insertable/updatable
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;    

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;   

    // Many-to-Many relationship with Category
    @ManyToMany
    @JoinTable( 
        name = "movie_categories", 
        joinColumns = @JoinColumn(name = "movie_id"), 
        inverseJoinColumns = @JoinColumn(name = "category_id") 
    )
    @JsonIgnore // to prevent circular references during JSON serialization
    private Set<Category> categories = new HashSet<>();


    //Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public Integer getRuntimeMin() { return runtimeMin; }
    public void setRuntimeMin(Integer runtimeMin) { this.runtimeMin = runtimeMin; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
