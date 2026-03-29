package com.example.demo.service;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.dto.FeedbackResponse;
import com.example.demo.entity.Feedback;
import com.example.demo.entity.Schedule;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           UserRepository userRepository,
                           ScheduleRepository scheduleRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public FeedbackResponse createFeedback(Long userId, FeedbackRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", request.getScheduleId()));

        Feedback feedback = Feedback.builder()
                .user(user)
                .schedule(schedule)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        feedback = feedbackRepository.save(feedback);
        return mapToResponse(feedback);
    }

    public List<FeedbackResponse> getFeedbackBySchedule(Long scheduleId) {
        return feedbackRepository.findByScheduleId(scheduleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long scheduleId) {
        return feedbackRepository.getAverageRatingByScheduleId(scheduleId);
    }

    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feedback", "id", id);
        }
        feedbackRepository.deleteById(id);
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .userId(feedback.getUser().getId())
                .userFullName(feedback.getUser().getFullName())
                .scheduleId(feedback.getSchedule().getId())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
