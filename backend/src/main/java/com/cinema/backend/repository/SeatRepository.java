package com.cinema.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.backend.model.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByHallIdOrderByRowNumAscColNumAsc(Long hallId);
    long countByHallId(Long hallId);
    boolean existsByHallIdAndRowNumAndColNum(Long hallId, Integer rowNum, Integer colNum);
    
}
