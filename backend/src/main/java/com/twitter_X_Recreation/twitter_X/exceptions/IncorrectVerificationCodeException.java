package com.twitter_X_Recreation.twitter_X.exceptions;

public class IncorrectVerificationCodeException extends RuntimeException {
    public IncorrectVerificationCodeException() {
        super("The code provided is incorrect, please try again.");
    }
}
