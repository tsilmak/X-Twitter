package com.twitter_X_Recreation.twitter_X.exceptions;

public class EmailFailedToSendException extends RuntimeException {
    public EmailFailedToSendException(Exception e) {
    super("The email was not sent, failed to send email" + e);
    }

}
