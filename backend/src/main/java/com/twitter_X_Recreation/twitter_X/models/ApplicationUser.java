package com.twitter_X_Recreation.twitter_X.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", nullable = false, unique = true, length = 15)
    private String username;

    @Column(name = "name", nullable = false, length = 50)
    private String name;


    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "birth_date", nullable = false)
    private Date birthDate;

    @Column(name = "password")
    @JsonIgnore
    @Size(min = 8, max = 128, message = "The password length should be higher than 8 character and less than 128 char")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role_junction",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> authorities;

    private Boolean enabled;

    @Column(nullable = true)
    @JsonIgnore
    private Long verification;

    @Column(nullable = true)
    @JsonIgnore
    private Long verificationExpiryTime;

    @Column(nullable = true)
    @JsonIgnore
    private Long LastVerificationSentTime;


    public ApplicationUser() {
        this.authorities = new HashSet<>();
        this.enabled = false;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Role> authorities) {
        this.authorities = authorities;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Long getVerification() {
        return verification;
    }

    public void setVerification(Long verification) {
        this.verification = verification;
    }

    public Long getVerificationExpiryTime() {
        return verificationExpiryTime;
    }

    public void setVerificationExpiryTime(Long verificationExpiryTime) {
        this.verificationExpiryTime = verificationExpiryTime;
    }

    public Long getLastVerificationSentTime() {
        return LastVerificationSentTime;
    }

    public void setLastVerificationSentTime(Long lastVerificationSentTime) {
        LastVerificationSentTime = lastVerificationSentTime;
    }

    @Override
    public String toString() {
        return "ApplicationUser{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", birthDate=" + birthDate +
                ", password='" + password + '\'' +
                ", authorities=" + authorities +
                ", enabled=" + enabled +
                ", verification=" + verification +
                ", verificationExpiryTime=" + verificationExpiryTime +
                '}';
    }



}