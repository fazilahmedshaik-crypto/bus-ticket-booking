package com.example.demo.controller;

import com.example.demo.dto.BusRequest;
import com.example.demo.dto.BusResponse;
import com.example.demo.enums.BusType;
import com.example.demo.service.BusService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping
    public ResponseEntity<List<BusResponse>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusResponse> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<BusResponse>> getBusesByType(@PathVariable BusType type) {
        return ResponseEntity.ok(busService.getBusesByType(type));
    }

    @PostMapping
    public ResponseEntity<BusResponse> createBus(@Valid @RequestBody BusRequest request) {
        BusResponse response = busService.createBus(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusResponse> updateBus(@PathVariable Long id, @Valid @RequestBody BusRequest request) {
        return ResponseEntity.ok(busService.updateBus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(Map.of("message", "Bus deleted successfully"));
    }
}
