package com.example.demo.dto;

import java.time.LocalDateTime;

public class FeedbackResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long scheduleId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public FeedbackResponse() {}

    public FeedbackResponse(Long id, Long userId, String userFullName, Long scheduleId, int rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userFullName = userFullName;
        this.scheduleId = scheduleId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Manual Builder
    public static FeedbackResponseBuilder builder() {
        return new FeedbackResponseBuilder();
    }

    public static class FeedbackResponseBuilder {
        private Long id;
        private Long userId;
        private String userFullName;
        private Long scheduleId;
        private int rating;
        private String comment;
        private LocalDateTime createdAt;

        public FeedbackResponseBuilder id(Long id) { this.id = id; return this; }
        public FeedbackResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public FeedbackResponseBuilder userFullName(String userFullName) { this.userFullName = userFullName; return this; }
        public FeedbackResponseBuilder scheduleId(Long scheduleId) { this.scheduleId = scheduleId; return this; }
        public FeedbackResponseBuilder rating(int rating) { this.rating = rating; return this; }
        public FeedbackResponseBuilder comment(String comment) { this.comment = comment; return this; }
        public FeedbackResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public FeedbackResponse build() {
            return new FeedbackResponse(id, userId, userFullName, scheduleId, rating, comment, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }
    public Long getScheduleId() { return scheduleId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
