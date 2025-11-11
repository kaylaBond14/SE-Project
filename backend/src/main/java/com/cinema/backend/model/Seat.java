package com.cinema.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "seats",
    uniqueConstraints = @UniqueConstraint(name = "uq_seat", columnNames = {"hall_id","row_num","col_num"})
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hall_id", nullable = false, foreignKey = @ForeignKey(name = "fk_seat_hall"))
    private Hall hall;

    @Column(name = "row_num", nullable = false)
    private int rowNum;

    @Column(name = "col_num", nullable = false)
    private int colNum;

    @Column(name = "label")
    private String label; 

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Hall getHall() { return hall; }
    public void setHall(Hall hall) { this.hall = hall; }

    public int getRowNum() { return rowNum; }
    public void setRowNum(int rowNum) { this.rowNum = rowNum; }

    public int getColNum() { return colNum; }
    public void setColNum(int colNum) { this.colNum = colNum; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}

