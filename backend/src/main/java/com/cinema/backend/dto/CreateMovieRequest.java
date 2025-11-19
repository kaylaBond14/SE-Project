package com.cinema.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

import java.util.List;

public class CreateMovieRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String synopsis;

    @NotNull
    private Integer ratingId;

    @NotBlank
    private String trailerUrl;

    @NotBlank
    private String posterUrl;

    @NotNull
    @Positive
    private Integer runtimeMin;

    @NotNull
    private LocalDate releaseDate;

    @NotNull
    private List<Integer> categoryIds;

    public String getTitle() {
        return title;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public Integer getRatingId() {
        return ratingId;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public Integer getRuntimeMin() {
        return runtimeMin;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public void setRatingId(Integer ratingId) {
        this.ratingId = ratingId;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public void setRuntimeMin(Integer runtimeMin) {
        this.runtimeMin = runtimeMin;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public List<Integer> getCategoryIds() {
        return categoryIds;
    }
    
    public void setCategoryIds(List<Integer> categoryIds) {
        this.categoryIds = categoryIds;
    }
}

