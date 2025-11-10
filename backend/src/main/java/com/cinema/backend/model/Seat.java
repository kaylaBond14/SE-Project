package com.cinema.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seats",
       uniqueConstraints = @UniqueConstraint(name = "uq_seat", columnNames = {"hall_id", "row_num", "col_num"})
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hall_id", nullable = false, foreignKey = @ForeignKey(name = "fk_seat_hall"))
    private Hall hall;

    @Column(name = "row_num", nullable = false)
    private Integer rowNum;

    @Column(name = "col_num", nullable = false)
    private Integer colNum;

    public Seat() {}

    public Seat(Hall hall, Integer rowNum, Integer colNum) {
        this.hall = hall;
        this.rowNum = rowNum;
        this.colNum = colNum;
    }

    // getters/setters
    public Long getId() { return id; }  
    public void setId(Long id) { this.id = id; }

    public Hall getHall() { return hall; }
    public void setHall(Hall hall) { this.hall = hall; }

    public Integer getRowNum() { return rowNum; }
    public void setRowNum(Integer rowNum) { this.rowNum = rowNum; }

    public Integer getColNum() { return colNum; }
    public void setColNum(Integer colNum) { this.colNum = colNum; }

}
