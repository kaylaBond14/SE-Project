package com.cinema.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_statuses")
public class UserStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Short id;  //TINYINT UNSIGNED

    @Column(name = "status_name", nullable = false, unique = true, length = 20)
    private String statusName; //VARCHAR(20) NOT NULL UNIQUE

    @Column(length = 100)
    private String description; //VARCHAR(100)

    public UserStatus() {}

    public UserStatus(String statusName, String description) {
        this.statusName = statusName;
        this.description = description;
    }

    // getters/setters
    public Short getId() { return id; } 
    public void setId(Short id) { this.id = id; }

    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}