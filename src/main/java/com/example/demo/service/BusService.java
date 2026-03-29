package com.example.demo.service;

import com.example.demo.dto.BusRequest;
import com.example.demo.dto.BusResponse;
import com.example.demo.entity.Bus;
import com.example.demo.enums.BusType;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    public List<BusResponse> getAllBuses() {
        return busRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BusResponse getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "id", id));
        return mapToResponse(bus);
    }

    public List<BusResponse> getBusesByType(BusType type) {
        return busRepository.findByBusType(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BusResponse createBus(BusRequest request) {
        if (busRepository.existsByBusNumber(request.getBusNumber())) {
            throw new BadRequestException("Bus number already exists: " + request.getBusNumber());
        }

        Bus bus = Bus.builder()
                .busName(request.getBusName())
                .busNumber(request.getBusNumber())
                .busType(request.getBusType())
                .totalSeats(request.getTotalSeats())
                .operatorName(request.getOperatorName())
                .amenities(request.getAmenities())
                .build();

        bus = busRepository.save(bus);
        return mapToResponse(bus);
    }

    public BusResponse updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "id", id));

        bus.setBusName(request.getBusName());
        bus.setBusNumber(request.getBusNumber());
        bus.setBusType(request.getBusType());
        bus.setTotalSeats(request.getTotalSeats());
        bus.setOperatorName(request.getOperatorName());
        bus.setAmenities(request.getAmenities());

        bus = busRepository.save(bus);
        return mapToResponse(bus);
    }

    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bus", "id", id);
        }
        busRepository.deleteById(id);
    }

    public BusResponse mapToResponse(Bus bus) {
        return BusResponse.builder()
                .id(bus.getId())
                .busName(bus.getBusName())
                .busNumber(bus.getBusNumber())
                .busType(bus.getBusType().name())
                .totalSeats(bus.getTotalSeats())
                .operatorName(bus.getOperatorName())
                .amenities(bus.getAmenities())
                .build();
    }
}
