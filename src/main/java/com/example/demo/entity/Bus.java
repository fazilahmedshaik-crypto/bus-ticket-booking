package com.example.demo.entity;

import com.example.demo.enums.BusType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Bus name is required")
    @Column(nullable = false)
    private String busName;

    @NotBlank(message = "Bus number is required")
    @Column(nullable = false, unique = true)
    private String busNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BusType busType;

    @Min(value = 1, message = "Total seats must be at least 1")
    @Column(nullable = false)
    private int totalSeats;

    @NotBlank(message = "Operator name is required")
    @Column(nullable = false)
    private String operatorName;

    private String amenities;

    public Bus() {}

    public Bus(String busName, String busNumber, BusType busType, int totalSeats, String operatorName, String amenities) {
        this.busName = busName;
        this.busNumber = busNumber;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.operatorName = operatorName;
        this.amenities = amenities;
    }

    // Manual Builder
    public static BusBuilder builder() {
        return new BusBuilder();
    }

    public static class BusBuilder {
        private String busName;
        private String busNumber;
        private BusType busType;
        private int totalSeats;
        private String operatorName;
        private String amenities;

        public BusBuilder busName(String busName) { this.busName = busName; return this; }
        public BusBuilder busNumber(String busNumber) { this.busNumber = busNumber; return this; }
        public BusBuilder busType(BusType busType) { this.busType = busType; return this; }
        public BusBuilder totalSeats(int totalSeats) { this.totalSeats = totalSeats; return this; }
        public BusBuilder operatorName(String operatorName) { this.operatorName = operatorName; return this; }
        public BusBuilder amenities(String amenities) { this.amenities = amenities; return this; }
        public Bus build() {
            return new Bus(busName, busNumber, busType, totalSeats, operatorName, amenities);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public BusType getBusType() { return busType; }
    public void setBusType(BusType busType) { this.busType = busType; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }
    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }
}
