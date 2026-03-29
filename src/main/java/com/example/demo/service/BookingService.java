package com.example.demo.service;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Schedule;
import com.example.demo.entity.User;
import com.example.demo.enums.BookingStatus;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);
    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final ScheduleService scheduleService;

    public BookingService(BookingRepository bookingRepository,
                          ScheduleRepository scheduleRepository,
                          UserRepository userRepository,
                          ScheduleService scheduleService) {
        this.bookingRepository = bookingRepository;
        this.scheduleRepository = scheduleRepository;
        this.userRepository = userRepository;
        this.scheduleService = scheduleService;
    }

    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", request.getScheduleId()));

        if (!schedule.isActive()) {
            throw new BadRequestException("This schedule is no longer active");
        }

        if (schedule.getAvailableSeats() < request.getSeatCount()) {
            throw new BadRequestException("Not enough seats available. Available: " + schedule.getAvailableSeats());
        }

        // Decrement available seats
        schedule.setAvailableSeats(schedule.getAvailableSeats() - request.getSeatCount());
        scheduleRepository.save(schedule);

        Booking booking = Booking.builder()
                .user(user)
                .schedule(schedule)
                .seatCount(request.getSeatCount())
                .totalFare(schedule.getFare() * request.getSeatCount())
                .status(BookingStatus.PENDING)
                .passengerName(request.getPassengerName())
                .passengerPhone(request.getPassengerPhone())
                .passengerEmail(request.getPassengerEmail())
                .build();

        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse approveBooking(Long bookingId, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminId));

        if (admin.getRole() != com.example.demo.enums.Role.ADMIN) {
            throw new BadRequestException("Only administrators can approve bookings");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be approved. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        log.info("Booking ID {} approved by admin ID {}", bookingId, adminId);
        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        // Restore available seats
        Schedule schedule = booking.getSchedule();
        schedule.setAvailableSeats(schedule.getAvailableSeats() + booking.getSeatCount());
        scheduleRepository.save(schedule);

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        return mapToResponse(booking);
    }

    public List<BookingResponse> getBookingsByUser(Long userId) {
        List<Booking> bookings = bookingRepository.findByUser_Id(userId);
        log.info("Found {} bookings for user ID: {}", bookings.size(), userId);
        return bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        if (booking == null) return null;
        
        Schedule s = booking.getSchedule();
        if (s == null) {
            log.error("Booking ID {} has no associated schedule!", booking.getId());
            throw new RuntimeException("Data inconsistency: Booking has no schedule");
        }
        
        if (s.getRoute() == null) {
            log.error("Schedule ID {} has no associated route!", s.getId());
        }
        
        if (s.getBus() == null) {
            log.error("Schedule ID {} has no associated bus!", s.getId());
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userFullName(booking.getUser() != null ? booking.getUser().getFullName() : "Unknown")
                .schedule(scheduleService.mapToResponse(s))
                .seatCount(booking.getSeatCount())
                .totalFare(booking.getTotalFare())
                .status(booking.getStatus() != null ? booking.getStatus().name() : "PENDING")
                .bookingTime(booking.getBookingTime())
                .passengerName(booking.getPassengerName())
                .passengerPhone(booking.getPassengerPhone())
                .passengerEmail(booking.getPassengerEmail())
                .source(s.getRoute() != null ? s.getRoute().getSource() : "N/A")
                .destination(s.getRoute() != null ? s.getRoute().getDestination() : "N/A")
                .busName(s.getBus() != null ? s.getBus().getBusName() : "N/A")
                .journeyDate(s.getJourneyDate() != null ? s.getJourneyDate().toString() : "N/A")
                .build();
    }
}
