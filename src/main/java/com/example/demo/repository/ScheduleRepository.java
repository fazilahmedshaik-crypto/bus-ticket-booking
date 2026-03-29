package com.example.demo.repository;

import com.example.demo.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByJourneyDate(LocalDate journeyDate);
    List<Schedule> findByBusId(Long busId);
    List<Schedule> findByRouteId(Long routeId);
    List<Schedule> findByActiveTrue();

    // Strategy 1 — exact city + exact date
    @Query("SELECT s FROM Schedule s WHERE LOWER(s.route.source) = LOWER(:source) AND LOWER(s.route.destination) = LOWER(:destination) AND s.journeyDate = :date AND s.active = true ORDER BY s.departureTime")
    Page<Schedule> searchSchedules(@Param("source") String source,
                                    @Param("destination") String destination,
                                    @Param("date") LocalDate date,
                                    Pageable pageable);

    // Strategy 2 — exact city, any date
    @Query("SELECT s FROM Schedule s WHERE LOWER(s.route.source) = LOWER(:source) AND LOWER(s.route.destination) = LOWER(:destination) AND s.active = true ORDER BY s.journeyDate, s.departureTime")
    Page<Schedule> searchByRoute(@Param("source") String source,
                                  @Param("destination") String destination,
                                  Pageable pageable);

    // Strategy 3 — partial LIKE match on city names
    @Query("SELECT s FROM Schedule s WHERE LOWER(s.route.source) LIKE LOWER(CONCAT('%', :source, '%')) AND LOWER(s.route.destination) LIKE LOWER(CONCAT('%', :destination, '%')) AND s.active = true ORDER BY s.journeyDate, s.departureTime")
    Page<Schedule> searchByRouteLike(@Param("source") String source,
                                      @Param("destination") String destination,
                                      Pageable pageable);

    // Strategy 4 — browse all upcoming active schedules
    @Query("SELECT s FROM Schedule s WHERE s.active = true AND s.journeyDate >= :today ORDER BY s.journeyDate, s.departureTime")
    Page<Schedule> findAllActive(@Param("today") LocalDate today, Pageable pageable);
}
