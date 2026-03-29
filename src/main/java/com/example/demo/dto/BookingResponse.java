package com.example.demo.dto;

import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private ScheduleResponse schedule;
    private int seatCount;
    private double totalFare;
    private double totalPrice; // Added for frontend compatibility
    private String status;
    private LocalDateTime bookingTime;
    private String passengerName;
    private String passengerPhone;
    private String passengerEmail;

    // Flattened fields for frontend
    private String source;
    private String destination;
    private String busName;
    private String journeyDate;

    public BookingResponse() {}

    public BookingResponse(Long id, Long userId, String userFullName, ScheduleResponse schedule, 
                           int seatCount, double totalFare, String status, LocalDateTime bookingTime, 
                           String passengerName, String passengerPhone, String passengerEmail,
                           String source, String destination, String busName, String journeyDate) {
        this.id = id;
        this.userId = userId;
        this.userFullName = userFullName;
        this.schedule = schedule;
        this.seatCount = seatCount;
        this.totalFare = totalFare;
        this.totalPrice = totalFare;
        this.status = status;
        this.bookingTime = bookingTime;
        this.passengerName = passengerName;
        this.passengerPhone = passengerPhone;
        this.passengerEmail = passengerEmail;
        this.source = source;
        this.destination = destination;
        this.busName = busName;
        this.journeyDate = journeyDate;
    }

    // Manual Builder
    public static BookingResponseBuilder builder() {
        return new BookingResponseBuilder();
    }

    public static class BookingResponseBuilder {
        private Long id;
        private Long userId;
        private String userFullName;
        private ScheduleResponse schedule;
        private int seatCount;
        private double totalFare;
        private String status;
        private LocalDateTime bookingTime;
        private String passengerName;
        private String passengerPhone;
        private String passengerEmail;
        private String source;
        private String destination;
        private String busName;
        private String journeyDate;

        public BookingResponseBuilder id(Long id) { this.id = id; return this; }
        public BookingResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public BookingResponseBuilder userFullName(String userFullName) { this.userFullName = userFullName; return this; }
        public BookingResponseBuilder schedule(ScheduleResponse schedule) { this.schedule = schedule; return this; }
        public BookingResponseBuilder seatCount(int seatCount) { this.seatCount = seatCount; return this; }
        public BookingResponseBuilder totalFare(double totalFare) { this.totalFare = totalFare; return this; }
        public BookingResponseBuilder status(String status) { this.status = status; return this; }
        public BookingResponseBuilder bookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; return this; }
        public BookingResponseBuilder passengerName(String passengerName) { this.passengerName = passengerName; return this; }
        public BookingResponseBuilder passengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; return this; }
        public BookingResponseBuilder passengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; return this; }
        public BookingResponseBuilder source(String source) { this.source = source; return this; }
        public BookingResponseBuilder destination(String destination) { this.destination = destination; return this; }
        public BookingResponseBuilder busName(String busName) { this.busName = busName; return this; }
        public BookingResponseBuilder journeyDate(String journeyDate) { this.journeyDate = journeyDate; return this; }
        
        public BookingResponse build() {
            return new BookingResponse(id, userId, userFullName, schedule, seatCount, totalFare, status, 
                                      bookingTime, passengerName, passengerPhone, passengerEmail,
                                      source, destination, busName, journeyDate);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }
    public ScheduleResponse getSchedule() { return schedule; }
    public void setSchedule(ScheduleResponse schedule) { this.schedule = schedule; }
    public int getSeatCount() { return seatCount; }
    public void setSeatCount(int seatCount) { this.seatCount = seatCount; }
    public double getTotalFare() { return totalFare; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; this.totalPrice = totalFare; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }
    public String getJourneyDate() { return journeyDate; }
    public void setJourneyDate(String journeyDate) { this.journeyDate = journeyDate; }
}
