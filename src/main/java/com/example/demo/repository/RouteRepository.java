package com.example.demo.repository;

import com.example.demo.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findBySourceAndDestination(String source, String destination);
    List<Route> findBySourceIgnoreCase(String source);
    List<Route> findByDestinationIgnoreCase(String destination);

    @Query("SELECT DISTINCT r.source FROM Route r ORDER BY r.source ASC")
    List<String> findUniqueSources();

    @Query("SELECT DISTINCT r.destination FROM Route r ORDER BY r.destination ASC")
    List<String> findUniqueDestinations();
}
