package com.cinema.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "halls",
       uniqueConstraints = @UniqueConstraint(name = "UK_halls_name", columnNames = "name"))
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id")
    private Integer id;

    @Column(name="name", nullable = false, length = 100)
    private String name;

    @Column(name = "seat_rows", nullable = false)
    private Integer seatRows;

    @Column(name = "seat_cols", nullable = false)
    private Integer seatCols;

    public Hall() {}

    public Hall(String name, Integer seatRows, Integer seatCols) {
        this.name = name;
        this.seatRows = seatRows;
        this.seatCols = seatCols;
    }

    // getters/setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSeatRows() { return seatRows; }
    public void setSeatRows(Integer seatRows) { this.seatRows = seatRows; }

    public Integer getSeatCols() { return seatCols; }
    public void setSeatCols(Integer seatCols) { this.seatCols = seatCols; }
}
