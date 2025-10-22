package com.twitter_X_Recreation.twitter_X.dto;

public class UpdatePhoneRequest {
    private String phoneNumber;
    private String username;

    public UpdatePhoneRequest(){}

    public UpdatePhoneRequest(String phoneNumber, String username) {
        this.phoneNumber = phoneNumber;
        this.username = username;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "UpdatePhoneRequest{" +
                "phoneNumber='" + phoneNumber + '\'' +
                '}';
    }
}
