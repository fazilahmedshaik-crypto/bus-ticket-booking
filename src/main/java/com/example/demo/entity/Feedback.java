package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(nullable = false)
    private int rating;

    @Size(max = 500)
    private String comment;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Feedback() {}

    public Feedback(User user, Schedule schedule, int rating, String comment) {
        this.user = user;
        this.schedule = schedule;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // Manual Builder
    public static FeedbackBuilder builder() {
        return new FeedbackBuilder();
    }

    public static class FeedbackBuilder {
        private User user;
        private Schedule schedule;
        private int rating;
        private String comment;

        public FeedbackBuilder user(User user) { this.user = user; return this; }
        public FeedbackBuilder schedule(Schedule schedule) { this.schedule = schedule; return this; }
        public FeedbackBuilder rating(int rating) { this.rating = rating; return this; }
        public FeedbackBuilder comment(String comment) { this.comment = comment; return this; }
        public Feedback build() {
            return new Feedback(user, schedule, rating, comment);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
