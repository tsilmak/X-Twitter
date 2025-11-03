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
        private final HttpStatus status;

        private ApiErrorException(Builder builder) {
            super(builder.error);
            this.exception = builder.exception;
            this.error = builder.error;
            this.path = builder.path;
            this.timestamp = builder.timestamp != null ? builder.timestamp : OffsetDateTime.now();
            this.status = builder.status != null ? builder.status : HttpStatus.BAD_REQUEST;
        }

        public static class Builder {
            private String exception;
            private String error;
            private String path;
            private OffsetDateTime timestamp;
            private HttpStatus status;

            public Builder exception(String exception) { this.exception = exception; return this; }
            public Builder error(String error) { this.error = error; return this; }
            public Builder path(String path) { this.path = path; return this; }
            public Builder timestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; return this; }
            public Builder status(HttpStatus status) { this.status = status; return this; }

            public ApiErrorException build() { return new ApiErrorException(this); }
        }

        public String getException() { return exception; }
        public String getError() { return error; }
        public String getPath() { return path; }
        public OffsetDateTime getTimestamp() { return timestamp; }
        public HttpStatus getStatus() { return status; }
    }

    public static ApiErrorException of(HttpServletRequest request, HttpStatus status, Exception e) {
        HttpStatus resolvedStatus =
                (e instanceof MissingAuthenticationTokenException || e instanceof InvalidJWTException)
                        ? HttpStatus.UNAUTHORIZED
                        : status;
        return new ApiErrorException.Builder()
                .exception(e.getClass().getSimpleName())
                .error(e.getMessage())
                .path(request.getRequestURI())
                .status(resolvedStatus)
                .build();
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

        return new ResponseEntity<>(response, e.getStatus());
    }

    @ExceptionHandler(MissingAuthenticationTokenException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleMissingAuthenticationTokenException(
            MissingAuthenticationTokenException e,
            HttpServletRequest request) {

        ApiErrorResponseDTO response = new ApiErrorResponseDTO(
                e.getMessage(),
                e.getClass().getSimpleName(),
                request.getRequestURI(),
                OffsetDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InvalidJWTException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleInvalidJWTException(
            InvalidJWTException e,
            HttpServletRequest request) {

        ApiErrorResponseDTO response = new ApiErrorResponseDTO(
                e.getMessage(),
                e.getClass().getSimpleName(),
                request.getRequestURI(),
                OffsetDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
}
