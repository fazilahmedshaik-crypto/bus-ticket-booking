package com.example.demo.dto;

public class BusResponse {
    private Long id;
    private String busName;
    private String busNumber;
    private String busType;
    private int totalSeats;
    private String operatorName;
    private String amenities;

    public BusResponse() {}

    public BusResponse(Long id, String busName, String busNumber, String busType, int totalSeats, String operatorName, String amenities) {
        this.id = id;
        this.busName = busName;
        this.busNumber = busNumber;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.operatorName = operatorName;
        this.amenities = amenities;
    }

    // Manual Builder
    public static BusResponseBuilder builder() {
        return new BusResponseBuilder();
    }

    public static class BusResponseBuilder {
        private Long id;
        private String busName;
        private String busNumber;
        private String busType;
        private int totalSeats;
        private String operatorName;
        private String amenities;

        public BusResponseBuilder id(Long id) { this.id = id; return this; }
        public BusResponseBuilder busName(String busName) { this.busName = busName; return this; }
        public BusResponseBuilder busNumber(String busNumber) { this.busNumber = busNumber; return this; }
        public BusResponseBuilder busType(String busType) { this.busType = busType; return this; }
        public BusResponseBuilder totalSeats(int totalSeats) { this.totalSeats = totalSeats; return this; }
        public BusResponseBuilder operatorName(String operatorName) { this.operatorName = operatorName; return this; }
        public BusResponseBuilder amenities(String amenities) { this.amenities = amenities; return this; }
        public BusResponse build() {
            return new BusResponse(id, busName, busNumber, busType, totalSeats, operatorName, amenities);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }
    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }
}
