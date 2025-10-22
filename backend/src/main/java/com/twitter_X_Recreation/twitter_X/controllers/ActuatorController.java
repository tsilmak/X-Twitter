package com.twitter_X_Recreation.twitter_X.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ActuatorController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/actuator/health")
    public ResponseEntity<?> health() {
        Map<String, Object> healthStatus = new HashMap<>();
        boolean isHealthy = true;
        
        // Check database connection
        boolean dbHealthy = checkDatabaseConnection();
        if (!dbHealthy) {
            isHealthy = false;
        }
        
        healthStatus.put("status", isHealthy ? "UP" : "DOWN");
        healthStatus.put("database", dbHealthy ? "UP" : "DOWN");
        
        if (isHealthy) {
            return ResponseEntity.ok(healthStatus);
        } else {
            return ResponseEntity.status(503).body(healthStatus);
        }
    }
    
    private boolean checkDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            // Simple connection test - just verify we can get a connection
            return connection != null && !connection.isClosed();
        } catch (SQLException e) {
            return false;
        }
    }
}
