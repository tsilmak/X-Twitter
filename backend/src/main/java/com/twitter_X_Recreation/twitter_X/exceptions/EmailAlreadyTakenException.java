package com.twitter_X_Recreation.twitter_X.exceptions;

public class EmailAlreadyTakenException  extends RuntimeException{

    public EmailAlreadyTakenException(){
        super("The email provided is already taken");
    }
}
