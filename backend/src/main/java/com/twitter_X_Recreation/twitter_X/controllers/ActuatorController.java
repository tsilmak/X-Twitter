package com.twitter_X_Recreation.twitter_X.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.redis.core.StringRedisTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ActuatorController {

    @Autowired
    private DataSource dataSource;

    private final StringRedisTemplate redisTemplate;

    public ActuatorController(@Value("${spring.datasource.url}") String dataSourceUrl, StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }



    @GetMapping("/actuator/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> healthStatus = new HashMap<>();
        boolean isHealthy = true;

        // Check database connection
        boolean dbHealthy = checkDatabaseConnection();
        boolean redisHealthy = checkRedisConnection();

        // Build response map
        healthStatus.put("database", dbHealthy ? "UP" : "DOWN");
        healthStatus.put("redis", redisHealthy ? "UP" : "DOWN");

        // Determine overall health
        if (!dbHealthy || !redisHealthy) {
            isHealthy = false;
        }

        healthStatus.put("status", isHealthy ? "UP" : "DOWN");

        // Return response
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

    public boolean checkRedisConnection() {
        try {
            assert redisTemplate.getConnectionFactory() != null;
            String result = redisTemplate.getConnectionFactory()
                    .getConnection()
                    .ping();
            return "PONG".equalsIgnoreCase(result);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
