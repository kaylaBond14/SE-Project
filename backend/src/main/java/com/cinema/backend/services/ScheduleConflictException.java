package com.cinema.backend.services;

public class ScheduleConflictException extends RuntimeException{
    public ScheduleConflictException(String message) {
        super(message);
    }    
}
