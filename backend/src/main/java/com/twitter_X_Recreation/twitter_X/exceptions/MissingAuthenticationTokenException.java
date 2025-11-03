package com.twitter_X_Recreation.twitter_X.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class MissingAuthenticationTokenException extends RuntimeException {
    public MissingAuthenticationTokenException() {
        super("Missing authentication token");
    }
}

