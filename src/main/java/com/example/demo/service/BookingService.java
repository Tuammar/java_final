package com.example.demo.service;

import com.example.demo.dto.BookingRequest;
import com.example.demo.model.Booking;
import com.example.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request, UUID userId) {
        // Проверяем, нет ли пересекающихся бронирований
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
            request.getSeatplaceId(),
            request.getStartTime(),
            request.getEndTime()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new IllegalStateException("Выбранное место уже забронировано на это время");
        }

        // Создаем новое бронирование
        Booking booking = new Booking();
        booking.setSpaceId(request.getSpaceId());
        booking.setSeatplaceId(request.getSeatplaceId());
        booking.setUserId(userId);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());

        return bookingRepository.save(booking);
    }
} 