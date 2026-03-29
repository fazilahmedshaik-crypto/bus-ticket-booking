package com.example.demo.controller;

import com.example.demo.dto.RouteRequest;
import com.example.demo.dto.RouteResponse;
import com.example.demo.service.RouteService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;
    private static final Logger log = LoggerFactory.getLogger(RouteController.class);

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<List<RouteResponse>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/sources")
    public ResponseEntity<List<String>> getAllSources() {
        log.info("Fetching all unique sources");
        try {
            List<String> sources = routeService.getAllSources();
            log.info("Found {} sources", sources.size());
            return ResponseEntity.ok(sources);
        } catch (Exception e) {
            log.error("Error fetching sources", e);
            throw e;
        }
    }

    @GetMapping("/destinations")
    public ResponseEntity<List<String>> getAllDestinations() {
        log.info("Fetching all unique destinations");
        try {
            List<String> destinations = routeService.getAllDestinations();
            log.info("Found {} destinations", destinations.size());
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            log.error("Error fetching destinations", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteResponse> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(routeService.getRouteById(id));
    }

    @PostMapping
    public ResponseEntity<RouteResponse> createRoute(@Valid @RequestBody RouteRequest request) {
        RouteResponse response = routeService.createRoute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RouteResponse> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(routeService.updateRoute(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(Map.of("message", "Route deleted successfully"));
    }
}
