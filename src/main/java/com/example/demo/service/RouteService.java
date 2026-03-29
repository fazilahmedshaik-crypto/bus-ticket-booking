package com.example.demo.service;

import com.example.demo.dto.RouteRequest;
import com.example.demo.dto.RouteResponse;
import com.example.demo.entity.Route;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.RouteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RouteResponse getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", id));
        return mapToResponse(route);
    }

    public List<RouteResponse> searchRoutes(String source, String destination) {
        return routeRepository.findBySourceAndDestination(source, destination).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<String> getAllSources() {
        log.info("RouteService: Calling repository for sources");
        return routeRepository.findUniqueSources();
    }

    public List<String> getAllDestinations() {
        log.info("RouteService: Calling repository for destinations");
        return routeRepository.findUniqueDestinations();
    }

    public RouteResponse createRoute(RouteRequest request) {
        Route route = Route.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .distanceKm(request.getDistanceKm())
                .estimatedDuration(request.getEstimatedDuration())
                .build();

        route = routeRepository.save(route);
        return mapToResponse(route);
    }

    public RouteResponse updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", id));

        route.setSource(request.getSource());
        route.setDestination(request.getDestination());
        route.setDistanceKm(request.getDistanceKm());
        route.setEstimatedDuration(request.getEstimatedDuration());

        route = routeRepository.save(route);
        return mapToResponse(route);
    }

    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Route", "id", id);
        }
        routeRepository.deleteById(id);
    }

    public RouteResponse mapToResponse(Route route) {
        return RouteResponse.builder()
                .id(route.getId())
                .source(route.getSource())
                .destination(route.getDestination())
                .distanceKm(route.getDistanceKm())
                .estimatedDuration(route.getEstimatedDuration())
                .build();
    }
}
