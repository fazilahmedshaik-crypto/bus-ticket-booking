package com.example.demo.controller;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.dto.FeedbackResponse;
import com.example.demo.security.SecurityUtils;
import com.example.demo.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final SecurityUtils securityUtils;

    public FeedbackController(FeedbackService feedbackService, SecurityUtils securityUtils) {
        this.feedbackService = feedbackService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> createFeedback(@Valid @RequestBody FeedbackRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        FeedbackResponse response = feedbackService.createFeedback(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackBySchedule(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(feedbackService.getFeedbackBySchedule(scheduleId));
    }

    @GetMapping("/schedule/{scheduleId}/rating")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long scheduleId) {
        Double avg = feedbackService.getAverageRating(scheduleId);
        return ResponseEntity.ok(Map.of(
                "scheduleId", scheduleId,
                "averageRating", avg != null ? avg : 0.0
        ));
    }

    @GetMapping("/my-feedback")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedback() {
        Long userId = securityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feedbackService.getFeedbackByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully"));
    }
}
