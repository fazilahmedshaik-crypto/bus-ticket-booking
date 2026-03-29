package com.example.demo.repository;

import com.example.demo.entity.Bus;
import com.example.demo.enums.BusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByBusType(BusType busType);
    List<Bus> findByOperatorName(String operatorName);
    boolean existsByBusNumber(String busNumber);
}
