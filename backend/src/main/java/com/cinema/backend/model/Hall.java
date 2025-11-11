package com.cinema.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "halls")
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "seat_rows", nullable = false)
    private Integer seatRows;

    @Column(name = "seat_cols", nullable = false)
    private Integer seatCols;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getSeatRows() { return seatRows; }
    public void setSeatRows(Integer seatRows) { this.seatRows = seatRows; }
    public Integer getSeatCols() { return seatCols; }
    public void setSeatCols(Integer seatCols) { this.seatCols = seatCols; }
}
