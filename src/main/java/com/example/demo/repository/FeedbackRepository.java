package com.example.demo.repository;

import com.example.demo.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByScheduleId(Long scheduleId);
    List<Feedback> findByUserId(Long userId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.schedule.id = :scheduleId")
    Double getAverageRatingByScheduleId(@Param("scheduleId") Long scheduleId);
}
