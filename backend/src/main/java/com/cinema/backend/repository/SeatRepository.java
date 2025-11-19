package com.cinema.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cinema.backend.dto.SeatView;
import com.cinema.backend.model.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByHall_IdOrderByRowNumAscColNumAsc(Long hallId);
    long countByHallId(Long hallId);
    boolean existsByHallIdAndRowNumAndColNum(Long hallId, Integer rowNum, Integer colNum);

    
}
