package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BookingRequest {
    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @Min(value = 1, message = "At least 1 seat must be booked")
    private int seatCount;

    private String passengerName;
    private String passengerPhone;
    private String passengerEmail;

    public BookingRequest() {}

    public BookingRequest(Long scheduleId, int seatCount, String passengerName, String passengerPhone, String passengerEmail) {
        this.scheduleId = scheduleId;
        this.seatCount = seatCount;
        this.passengerName = passengerName;
        this.passengerPhone = passengerPhone;
        this.passengerEmail = passengerEmail;
    }

    // Getters and Setters
    public Long getScheduleId() { return scheduleId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
    public int getSeatCount() { return seatCount; }
    public void setSeatCount(int seatCount) { this.seatCount = seatCount; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
}
