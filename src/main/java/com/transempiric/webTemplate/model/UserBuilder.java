package com.transempiric.webTemplate.model;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Date;

public class UserBuilder {
    private Long bId;
    private String bUsername;
    private String bFirstName;
    private String bLastName;
    private String bEmail;
    private String bPassword;
    private boolean bEnabled;
    private Timestamp bLastPasswordResetDate;
    private boolean bIsUsing2FA;
    private String bSecret;

    private Collection<Authority> bAuthorities;

    public UserBuilder() {
    }

    public UserBuilder(Long bId,
                       String bUsername, String bFirstName, String bLastName,
                       String bEmail, String bPassword, boolean bEnabled,
                       Timestamp bLastPasswordResetDate, boolean bIsUsing2FA, String bSecret,
                       Collection<Authority> authorities) {
        this.bId = bId;
        this.bUsername = bUsername;
        this.bFirstName = bFirstName;
        this.bLastName = bLastName;
        this.bEmail = bEmail;
        this.bPassword = bPassword;
        this.bEnabled = bEnabled;
        this.bLastPasswordResetDate = bLastPasswordResetDate;
        this.bIsUsing2FA = bIsUsing2FA;
        this.bSecret = bSecret;
        this.bAuthorities = bAuthorities;
    }

    public UserBuilder(User user) {
        this.bId = user.getId();
        this.bUsername = user.getUsername();
        this.bFirstName = user.getFirstName();
        this.bLastName = user.getLastName();
        this.bEmail = user.getEmail();
        this.bPassword = user.getPassword();
        this.bEnabled = user.isEnabled();
        this.bLastPasswordResetDate = user.getLastPasswordResetDate();
        this.bIsUsing2FA = user.isUsing2FA();
        this.bSecret = user.getSecret();
    }

    public User createUser() {
        return new User(bId,
                bUsername,
                bFirstName,
                bLastName,
                bEmail,
                bPassword,
                bEnabled,
                bLastPasswordResetDate,
                bIsUsing2FA,
                bSecret,
                bAuthorities
        );
    }


    public UserBuilder bId(Long bId) {
        this.bId = bId;
        return this;
    }

    public UserBuilder bUsername(String bUsername) {
        this.bUsername = bUsername;
        return this;
    }

    public UserBuilder bFirstName(String bFirstName) {
        this.bFirstName = bFirstName;
        return this;
    }

    public UserBuilder bLastName(String bLastName) {
        this.bLastName = bLastName;
        return this;
    }

    public UserBuilder bEmail(String bEmail) {
        this.bEmail = bEmail;
        return this;
    }

    public UserBuilder bPassword(String bPassword) {
        Date date = new Date();
        this.bLastPasswordResetDate = new Timestamp(date.getTime());
        this.bPassword = bPassword;
        return this;
    }

    public UserBuilder bEnabled(boolean bEnabled) {
        this.bEnabled = bEnabled;
        return this;
    }

    public UserBuilder bLastPasswordResetDate(Timestamp bLastPasswordResetDate) {
        this.bLastPasswordResetDate = bLastPasswordResetDate;
        return this;
    }

    public UserBuilder bIsUsing2FA(boolean bIsUsing2FA) {
        this.bIsUsing2FA = bIsUsing2FA;
        return this;
    }

    public UserBuilder bSecret(String bSecret) {
        this.bSecret = bSecret;
        return this;
    }

    public UserBuilder bAuthorities(Collection<Authority> bAuthorities) {
        this.bAuthorities = bAuthorities;
        return this;
    }
}