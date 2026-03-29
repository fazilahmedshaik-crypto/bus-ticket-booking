package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduleResponse {
    private Long id;
    private BusResponse bus;
    private RouteResponse route;
    private LocalDate journeyDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private double fare;
    private int availableSeats;
    private boolean active;
    
    // Flattened fields for frontend
    private String busName;
    private String busType;
    private String source;
    private String destination;
    private String estimatedDuration;
    private double price;
    private double distanceKm;

    public ScheduleResponse() {}

    public ScheduleResponse(Long id, BusResponse bus, RouteResponse route, LocalDate journeyDate, 
                            LocalTime departureTime, LocalTime arrivalTime, double fare, 
                            int availableSeats, boolean active, String busName, String busType,
                            String source, String destination, String estimatedDuration, double price,
                            double distanceKm) {
        this.id = id;
        this.bus = bus;
        this.route = route;
        this.journeyDate = journeyDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.fare = fare;
        this.availableSeats = availableSeats;
        this.active = active;
        this.busName = busName;
        this.busType = busType;
        this.source = source;
        this.destination = destination;
        this.estimatedDuration = estimatedDuration;
        this.price = price;
        this.distanceKm = distanceKm;
    }

    // Manual Builder
    public static ScheduleResponseBuilder builder() {
        return new ScheduleResponseBuilder();
    }

    public static class ScheduleResponseBuilder {
        private Long id;
        private BusResponse bus;
        private RouteResponse route;
        private LocalDate journeyDate;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private double fare;
        private int availableSeats;
        private boolean active;
        private String busName;
        private String busType;
        private String source;
        private String destination;
        private String estimatedDuration;
        private double price;
        private double distanceKm;

        public ScheduleResponseBuilder id(Long id) { this.id = id; return this; }
        public ScheduleResponseBuilder bus(BusResponse bus) { this.bus = bus; return this; }
        public ScheduleResponseBuilder route(RouteResponse route) { this.route = route; return this; }
        public ScheduleResponseBuilder journeyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; return this; }
        public ScheduleResponseBuilder departureTime(LocalTime departureTime) { this.departureTime = departureTime; return this; }
        public ScheduleResponseBuilder arrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; return this; }
        public ScheduleResponseBuilder fare(double fare) { this.fare = fare; return this; }
        public ScheduleResponseBuilder availableSeats(int availableSeats) { this.availableSeats = availableSeats; return this; }
        public ScheduleResponseBuilder active(boolean active) { this.active = active; return this; }
        public ScheduleResponseBuilder busName(String busName) { this.busName = busName; return this; }
        public ScheduleResponseBuilder busType(String busType) { this.busType = busType; return this; }
        public ScheduleResponseBuilder source(String source) { this.source = source; return this; }
        public ScheduleResponseBuilder destination(String destination) { this.destination = destination; return this; }
        public ScheduleResponseBuilder estimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public ScheduleResponseBuilder price(double price) { this.price = price; return this; }
        public ScheduleResponseBuilder distanceKm(double distanceKm) { this.distanceKm = distanceKm; return this; }

        public ScheduleResponse build() {
            return new ScheduleResponse(id, bus, route, journeyDate, departureTime, arrivalTime, fare, 
                                       availableSeats, active, busName, busType, source, destination, 
                                       estimatedDuration, price, distanceKm);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BusResponse getBus() { return bus; }
    public void setBus(BusResponse bus) { this.bus = bus; }
    public RouteResponse getRoute() { return route; }
    public void setRoute(RouteResponse route) { this.route = route; }
    public LocalDate getJourneyDate() { return journeyDate; }
    public void setJourneyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; }
    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public double getFare() { return fare; }
    public void setFare(double fare) { this.fare = fare; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }
    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
}
