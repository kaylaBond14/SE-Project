package com.cinema.backend.dto;

import java.util.List;

public class ReserveSeatsRequest {
    private Long bookingId;
    private List<SeatSelectionDto> selections;

    public ReserveSeatsRequest() {}

    public ReserveSeatsRequest(Long bookingId, List<SeatSelectionDto> selections) {
        this.bookingId = bookingId;
        this.selections = selections;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public List<SeatSelectionDto> getSelections() {
        return selections;
    }

    public void setSelections(List<SeatSelectionDto> selections) {
        this.selections = selections;
    }

    public List<Long> getSeatIds() {
        if (selections == null) return List.of();
        return selections.stream()
                .map(SeatSelectionDto::getSeatId)
                .toList();
    }


}
