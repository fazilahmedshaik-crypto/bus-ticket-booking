package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class RouteRequest {
    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @Positive(message = "Distance must be positive")
    private double distanceKm;

    private String estimatedDuration;

    public RouteRequest() {}

    public RouteRequest(String source, String destination, double distanceKm, String estimatedDuration) {
        this.source = source;
        this.destination = destination;
        this.distanceKm = distanceKm;
        this.estimatedDuration = estimatedDuration;
    }

    // Getters and Setters
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }
}
