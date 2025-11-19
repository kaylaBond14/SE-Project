package com.cinema.backend.repository;

import com.cinema.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    //Dont need any custom methods yet but later... can add
    //auto-create categories if admin types a new genre name
    //filter/search genres in admin page
}
