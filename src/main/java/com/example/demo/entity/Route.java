package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Source is required")
    @Column(nullable = false)
    private String source;

    @NotBlank(message = "Destination is required")
    @Column(nullable = false)
    private String destination;

    @Positive(message = "Distance must be positive")
    private double distanceKm;

    private String estimatedDuration;

    public Route() {}

    public Route(String source, String destination, double distanceKm, String estimatedDuration) {
        this.source = source;
        this.destination = destination;
        this.distanceKm = distanceKm;
        this.estimatedDuration = estimatedDuration;
    }

    // Manual Builder
    public static RouteBuilder builder() {
        return new RouteBuilder();
    }

    public static class RouteBuilder {
        private String source;
        private String destination;
        private double distanceKm;
        private String estimatedDuration;

        public RouteBuilder source(String source) { this.source = source; return this; }
        public RouteBuilder destination(String destination) { this.destination = destination; return this; }
        public RouteBuilder distanceKm(double distanceKm) { this.distanceKm = distanceKm; return this; }
        public RouteBuilder estimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public Route build() {
            return new Route(source, destination, distanceKm, estimatedDuration);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }
}
