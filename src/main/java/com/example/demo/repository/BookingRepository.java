package com.example.demo.repository;

import com.example.demo.entity.Booking;
import com.example.demo.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_Id(Long userId);
    List<Booking> findBySchedule_Id(Long scheduleId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
}
