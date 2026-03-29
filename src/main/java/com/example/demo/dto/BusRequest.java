package com.example.demo.dto;

import com.example.demo.enums.BusType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BusRequest {
    @NotBlank(message = "Bus name is required")
    private String busName;

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotNull(message = "Bus type is required")
    private BusType busType;

    @Min(value = 1, message = "Total seats must be at least 1")
    private int totalSeats;

    @NotBlank(message = "Operator name is required")
    private String operatorName;

    private String amenities;

    public BusRequest() {}

    public BusRequest(String busName, String busNumber, BusType busType, int totalSeats, String operatorName, String amenities) {
        this.busName = busName;
        this.busNumber = busNumber;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.operatorName = operatorName;
        this.amenities = amenities;
    }

    // Getters and Setters
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
