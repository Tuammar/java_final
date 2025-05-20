package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class BookingRequest {
    private String spaceId;
    private String seatplaceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Getters and Setters
    public UUID getSpaceId() {
        return UUID.fromString(spaceId);
    }

    public void setSpaceId(String spaceId) {
        this.spaceId = spaceId;
    }

    public UUID getSeatplaceId() {
        return UUID.fromString(seatplaceId);
    }

    public void setSeatplaceId(String seatplaceId) {
        this.seatplaceId = seatplaceId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
} 