package com.twitter_X_Recreation.twitter_X.dto;

import java.time.OffsetDateTime;

public class ApiErrorResponseDTO {

    private final String error;      // user-readable message
    private final String exception;  // exception class name
    private final String path;
    private final OffsetDateTime timestamp;

    public ApiErrorResponseDTO(String error, String exception, String path, OffsetDateTime timestamp) {
        this.error = error;
        this.exception = exception;
        this.path = path;
        this.timestamp = timestamp != null ? timestamp : OffsetDateTime.now();
    }

    public String getError() {
        return error;
    }

    public String getException() {
        return exception;
    }

    public String getPath() {
        return path;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }
}
