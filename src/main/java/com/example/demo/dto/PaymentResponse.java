package com.example.demo.dto;

import java.time.LocalDateTime;

public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private double amount;
    private String paymentMethod;
    private String status;
    private String transactionId;
    private LocalDateTime paymentTime;

    public PaymentResponse() {}

    public PaymentResponse(Long id, Long bookingId, double amount, String paymentMethod, String status, String transactionId, LocalDateTime paymentTime) {
        this.id = id;
        this.bookingId = bookingId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
        this.paymentTime = paymentTime;
    }

    // Manual Builder
    public static PaymentResponseBuilder builder() {
        return new PaymentResponseBuilder();
    }

    public static class PaymentResponseBuilder {
        private Long id;
        private Long bookingId;
        private double amount;
        private String paymentMethod;
        private String status;
        private String transactionId;
        private LocalDateTime paymentTime;

        public PaymentResponseBuilder id(Long id) { this.id = id; return this; }
        public PaymentResponseBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public PaymentResponseBuilder amount(double amount) { this.amount = amount; return this; }
        public PaymentResponseBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentResponseBuilder status(String status) { this.status = status; return this; }
        public PaymentResponseBuilder transactionId(String transactionId) { this.transactionId = transactionId; return this; }
        public PaymentResponseBuilder paymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; return this; }
        public PaymentResponse build() {
            return new PaymentResponse(id, bookingId, amount, paymentMethod, status, transactionId, paymentTime);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }
}
