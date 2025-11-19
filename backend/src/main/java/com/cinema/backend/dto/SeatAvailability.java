package com.cinema.backend.dto;

public class SeatAvailability {
    private Long seatId;
    private int rowNum;
    private int colNum;
    private String label;
    private boolean reserved;

    public SeatAvailability() {}
    public SeatAvailability(Long seatId, int rowNum, int colNum, String label, boolean reserved) {
        this.seatId = seatId;
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.label = label;
        this.reserved = reserved;
    }

    public Long getSeatId() { return seatId; }
    public int getRowNum() { return rowNum; }
    public int getColNum() { return colNum; }
    public String getLabel() { return label; }
    public boolean isReserved() { return reserved; }

    public void setSeatId(Long seatId) { this.seatId = seatId; }
    public void setRowNum(int rowNum) { this.rowNum = rowNum; }
    public void setColNum(int colNum) { this.colNum = colNum; }
    public void setLabel(String label) { this.label = label; }
    public void setReserved(boolean reserved) { this.reserved = reserved; }






    
}
