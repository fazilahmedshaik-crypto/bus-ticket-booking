package com.example.demo.service;

import com.example.demo.dto.ScheduleRequest;
import com.example.demo.dto.ScheduleResponse;
import com.example.demo.entity.Bus;
import com.example.demo.entity.Route;
import com.example.demo.entity.Schedule;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.BusRepository;
import com.example.demo.repository.RouteRepository;
import com.example.demo.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final BusService busService;
    private final RouteService routeService;

    public ScheduleService(ScheduleRepository scheduleRepository,
                           BusRepository busRepository,
                           RouteRepository routeRepository,
                           BusService busService,
                           RouteService routeService) {
        this.scheduleRepository = scheduleRepository;
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
        this.busService = busService;
        this.routeService = routeService;
    }

    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ScheduleResponse getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));
        return mapToResponse(schedule);
    }

    public Page<ScheduleResponse> searchSchedules(String source, String destination, LocalDate date, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        boolean hasSource = source != null && !source.isBlank();
        boolean hasDest   = destination != null && !destination.isBlank();

        // Strategy 1: exact city + date
        if (hasSource && hasDest && date != null) {
            Page<Schedule> r = scheduleRepository.searchSchedules(source, destination, date, pageable);
            if (r.getTotalElements() > 0) return r.map(this::mapToResponse);
        }

        // Strategy 2: exact city, any date
        if (hasSource && hasDest) {
            Page<Schedule> r = scheduleRepository.searchByRoute(source, destination, pageable);
            if (r.getTotalElements() > 0) return r.map(this::mapToResponse);

            // Strategy 3: partial LIKE match
            Page<Schedule> r2 = scheduleRepository.searchByRouteLike(source, destination, pageable);
            if (r2.getTotalElements() > 0) return r2.map(this::mapToResponse);
        }

        // Strategy 4: browse all upcoming
        return scheduleRepository.findAllActive(LocalDate.now(), pageable).map(this::mapToResponse);
    }


    public List<ScheduleResponse> getSchedulesByDate(LocalDate date) {
        return scheduleRepository.findByJourneyDate(date).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ScheduleResponse createSchedule(ScheduleRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "id", request.getBusId()));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", request.getRouteId()));

        Schedule schedule = Schedule.builder()
                .bus(bus)
                .route(route)
                .journeyDate(request.getJourneyDate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .fare(request.getFare())
                .availableSeats(bus.getTotalSeats())
                .active(true)
                .build();

        schedule = scheduleRepository.save(schedule);
        return mapToResponse(schedule);
    }

    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "id", request.getBusId()));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", request.getRouteId()));

        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setJourneyDate(request.getJourneyDate());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setFare(request.getFare());
        schedule.setAvailableSeats(bus.getTotalSeats());

        schedule = scheduleRepository.save(schedule);
        return mapToResponse(schedule);
    }

    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", "id", id));
        schedule.setActive(false);
        scheduleRepository.save(schedule);
    }

    public ScheduleResponse mapToResponse(Schedule schedule) {
        if (schedule == null) return null;
        Bus b = schedule.getBus();
        Route r = schedule.getRoute();
        
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .bus(busService.mapToResponse(b))
                .route(routeService.mapToResponse(r))
                .journeyDate(schedule.getJourneyDate())
                .departureTime(schedule.getDepartureTime())
                .arrivalTime(schedule.getArrivalTime())
                .fare(schedule.getFare())
                .availableSeats(schedule.getAvailableSeats())
                .active(schedule.isActive())
                .busName(b != null ? b.getBusName() : "N/A")
                .busType(b != null && b.getBusType() != null ? b.getBusType().name() : "N/A")
                .source(r != null ? r.getSource() : "N/A")
                .destination(r != null ? r.getDestination() : "N/A")
                .estimatedDuration(r != null ? r.getEstimatedDuration() : "N/A")
                .price(schedule.getFare())
                .distanceKm(r != null ? r.getDistanceKm() : 0.0)
                .build();
    }
}
