package com.twitter_X_Recreation.twitter_X.exceptions;

public class UserDoesNotExistException extends RuntimeException {
    public UserDoesNotExistException() {
        super("The user does not exist");
    }
}
