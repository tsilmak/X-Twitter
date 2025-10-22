package com.twitter_X_Recreation.twitter_X.exceptions;

import com.twitter_X_Recreation.twitter_X.dto.ApiErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.OffsetDateTime;

@ControllerAdvice
public class ApiExceptionHandler {

    public static class ApiErrorException extends RuntimeException {
        private final String exception;
        private final String error;
        private final String path;
        private final OffsetDateTime timestamp;

        private ApiErrorException(Builder builder) {
            super(builder.error);
            this.exception = builder.exception;
            this.error = builder.error;
            this.path = builder.path;
            this.timestamp = builder.timestamp != null ? builder.timestamp : OffsetDateTime.now();
        }

        public static class Builder {
            private String exception;
            private String error;
            private String path;
            private OffsetDateTime timestamp;

            public Builder exception(String exception) { this.exception = exception; return this; }
            public Builder error(String error) { this.error = error; return this; }
            public Builder path(String path) { this.path = path; return this; }
            public Builder timestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; return this; }

            public ApiErrorException build() { return new ApiErrorException(this); }
        }

        public String getException() { return exception; }
        public String getError() { return error; }
        public String getPath() { return path; }
        public OffsetDateTime getTimestamp() { return timestamp; }
    }

    @ExceptionHandler(ApiErrorException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleApiErrorException(
            ApiErrorException e,
            HttpServletRequest request) {

        String path = e.getPath() != null ? e.getPath() : request.getRequestURI();
        OffsetDateTime timestamp = e.getTimestamp();

        ApiErrorResponseDTO response = new ApiErrorResponseDTO(
                e.getError(),
                e.getException(),
                path,
                timestamp
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
