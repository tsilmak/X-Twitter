package com.twitter_X_Recreation.twitter_X.exceptions;

public class VerificationCodeExpiredException extends RuntimeException {
    public VerificationCodeExpiredException() {
        super("The code has expired, please ask for a new code.");
    }
}
