package com.example.demo.dto;

public class RouteResponse {
    private Long id;
    private String source;
    private String destination;
    private double distanceKm;
    private String estimatedDuration;

    public RouteResponse() {}

    public RouteResponse(Long id, String source, String destination, double distanceKm, String estimatedDuration) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.distanceKm = distanceKm;
        this.estimatedDuration = estimatedDuration;
    }

    // Manual Builder
    public static RouteResponseBuilder builder() {
        return new RouteResponseBuilder();
    }

    public static class RouteResponseBuilder {
        private Long id;
        private String source;
        private String destination;
        private double distanceKm;
        private String estimatedDuration;

        public RouteResponseBuilder id(Long id) { this.id = id; return this; }
        public RouteResponseBuilder source(String source) { this.source = source; return this; }
        public RouteResponseBuilder destination(String destination) { this.destination = destination; return this; }
        public RouteResponseBuilder distanceKm(double distanceKm) { this.distanceKm = distanceKm; return this; }
        public RouteResponseBuilder estimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public RouteResponse build() {
            return new RouteResponse(id, source, destination, distanceKm, estimatedDuration);
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
