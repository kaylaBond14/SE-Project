package com.cinema.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "user_types")
public class UserType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Short id;  //TINYINT UNSIGNED

    @Column(name = "type_name", nullable = false, unique = true, length = 20)
    private String typeName; //VARCHAR(20) NOT NULL UNIQUE

    @Column(length = 100)
    private String description; //VARCHAR(100)

    public UserType() {}

    public UserType(String typeName, String description) {
        this.typeName = typeName;
        this.description = description;
    }

    // getters/setters
    public Short getId() { return id; }
    public void setId(Short id) { this.id = id; }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

