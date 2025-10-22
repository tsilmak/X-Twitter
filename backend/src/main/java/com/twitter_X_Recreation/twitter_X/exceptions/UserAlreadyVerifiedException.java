package com.twitter_X_Recreation.twitter_X.exceptions;

public class UserAlreadyVerifiedException extends RuntimeException {
    public UserAlreadyVerifiedException() {
      super("The user is already verified.");
      ;
    }
}
