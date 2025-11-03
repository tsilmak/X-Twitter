package com.twitter_X_Recreation.twitter_X.exceptions;

public class InvalidJWTException extends RuntimeException {
    public InvalidJWTException() {
        super("Invalid JWT");
    }
}

