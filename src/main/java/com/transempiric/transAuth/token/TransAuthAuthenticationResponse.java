/*
 * MIT License
 *
 * Copyright (c) 2018 Transempiric
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package com.transempiric.transAuth.token;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.Collection;

@JsonIgnoreProperties(value = {"authTokenReadableExpiresIn", "refreshTokenReadableExpiresIn"})
public class TransAuthAuthenticationResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private Collection<? extends GrantedAuthority> authorities;
    private String authToken;
    private Long authTokenExpiresOn;
    private String refreshToken;
    private Long refreshTokenExpiresOn;

    public TransAuthAuthenticationResponse() {
        super();
    }

    public String getUsername() {
        return username;
    }

    public TransAuthAuthenticationResponse username(String username) {
        this.username = username;
        return this;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public TransAuthAuthenticationResponse authorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
        return this;
    }

    @JsonProperty("auth_token")
    public String getAuthToken() {
        return authToken;
    }

    public TransAuthAuthenticationResponse authToken(String authToken) {
        this.authToken = authToken;
        return this;
    }

    @JsonProperty("auth_expiration")
    public Long getAuthTokenExpiresOn() {
        return authTokenExpiresOn;
    }

    public TransAuthAuthenticationResponse authTokenExpiresOn(Long authTokenExpiresOn) {
        this.authTokenExpiresOn = authTokenExpiresOn;
        return this;
    }

    @JsonProperty("refresh_token")
    public String getRefreshToken() {
        return refreshToken;
    }

    public TransAuthAuthenticationResponse refreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        return this;
    }

    @JsonProperty("refresh_expiration")
    public Long getRefreshTokenExpiresOn() {
        return refreshTokenExpiresOn;
    }

    public TransAuthAuthenticationResponse refreshTokenExpiresOn(Long refreshTokenExpiresOn) {
        this.refreshTokenExpiresOn = refreshTokenExpiresOn;
        return this;
    }
}