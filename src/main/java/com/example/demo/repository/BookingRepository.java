package com.example.demo.repository;

import com.example.demo.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    @Query("SELECT b FROM Booking b WHERE b.seatplaceId = :seatplaceId " +
           "AND ((b.startTime <= :endTime AND b.endTime >= :startTime) " +
           "OR (b.startTime >= :startTime AND b.startTime < :endTime))")
    List<Booking> findOverlappingBookings(
        @Param("seatplaceId") UUID seatplaceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
} 