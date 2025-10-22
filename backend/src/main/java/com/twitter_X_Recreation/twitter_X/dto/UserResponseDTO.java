package com.twitter_X_Recreation.twitter_X.dto;

import java.sql.Date;

public class UserResponseDTO {
    private String username;
    private String name;
    private String email;
    private Date birthDate;

    // constructor
    public UserResponseDTO(String username, String name, String email, Date birthDate) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.birthDate = birthDate;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

}
