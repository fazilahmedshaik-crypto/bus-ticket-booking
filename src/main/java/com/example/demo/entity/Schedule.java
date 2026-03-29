package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(nullable = false)
    private LocalDate journeyDate;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Positive(message = "Fare must be positive")
    @Column(nullable = false)
    private double fare;

    @Min(value = 0, message = "Available seats cannot be negative")
    @Column(nullable = false)
    private int availableSeats;

    @Column(nullable = false)
    private boolean active = true;

    public Schedule() {}

    public Schedule(Bus bus, Route route, LocalDate journeyDate, LocalTime departureTime, 
                    LocalTime arrivalTime, double fare, int availableSeats, boolean active) {
        this.bus = bus;
        this.route = route;
        this.journeyDate = journeyDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.fare = fare;
        this.availableSeats = availableSeats;
        this.active = active;
    }

    // Manual Builder
    public static ScheduleBuilder builder() {
        return new ScheduleBuilder();
    }

    public static class ScheduleBuilder {
        private Bus bus;
        private Route route;
        private LocalDate journeyDate;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private double fare;
        private int availableSeats;
        private boolean active = true;

        public ScheduleBuilder bus(Bus bus) { this.bus = bus; return this; }
        public ScheduleBuilder route(Route route) { this.route = route; return this; }
        public ScheduleBuilder journeyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; return this; }
        public ScheduleBuilder departureTime(LocalTime departureTime) { this.departureTime = departureTime; return this; }
        public ScheduleBuilder arrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; return this; }
        public ScheduleBuilder fare(double fare) { this.fare = fare; return this; }
        public ScheduleBuilder availableSeats(int availableSeats) { this.availableSeats = availableSeats; return this; }
        public ScheduleBuilder active(boolean active) { this.active = active; return this; }
        public Schedule build() {
            return new Schedule(bus, route, journeyDate, departureTime, arrivalTime, fare, availableSeats, active);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }
    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
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
}
