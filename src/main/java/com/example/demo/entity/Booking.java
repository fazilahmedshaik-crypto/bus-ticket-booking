package com.example.demo.entity;

import com.example.demo.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Min(value = 1, message = "At least 1 seat must be booked")
    @Column(nullable = false)
    private int seatCount;

    @Column(nullable = false)
    private double totalFare;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime bookingTime = LocalDateTime.now();

    private String passengerName;
    private String passengerPhone;
    private String passengerEmail;

    public Booking() {}

    public Booking(User user, Schedule schedule, int seatCount, double totalFare, 
                   BookingStatus status, String passengerName, String passengerPhone, 
                   String passengerEmail, LocalDateTime bookingTime) {
        this.user = user;
        this.schedule = schedule;
        this.seatCount = seatCount;
        this.totalFare = totalFare;
        this.status = status != null ? status : BookingStatus.PENDING;
        this.bookingTime = bookingTime != null ? bookingTime : LocalDateTime.now();
        this.passengerName = passengerName;
        this.passengerPhone = passengerPhone;
        this.passengerEmail = passengerEmail;
    }

    // Manual Builder
    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private User user;
        private Schedule schedule;
        private int seatCount;
        private double totalFare;
        private BookingStatus status;
        private String passengerName;
        private String passengerPhone;
        private String passengerEmail;
        private LocalDateTime bookingTime;

        public BookingBuilder user(User user) { this.user = user; return this; }
        public BookingBuilder schedule(Schedule schedule) { this.schedule = schedule; return this; }
        public BookingBuilder seatCount(int seatCount) { this.seatCount = seatCount; return this; }
        public BookingBuilder totalFare(double totalFare) { this.totalFare = totalFare; return this; }
        public BookingBuilder status(BookingStatus status) { this.status = status; return this; }
        public BookingBuilder passengerName(String passengerName) { this.passengerName = passengerName; return this; }
        public BookingBuilder passengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; return this; }
        public BookingBuilder passengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; return this; }
        public BookingBuilder bookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; return this; }
        public Booking build() {
            return new Booking(user, schedule, seatCount, totalFare, status, passengerName, 
                             passengerPhone, passengerEmail, bookingTime);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }
    public int getSeatCount() { return seatCount; }
    public void setSeatCount(int seatCount) { this.seatCount = seatCount; }
    public double getTotalFare() { return totalFare; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
}
