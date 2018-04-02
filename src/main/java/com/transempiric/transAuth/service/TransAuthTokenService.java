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

package com.transempiric.transAuth.service;

import com.transempiric.transAuth.enums.TransAuthClaimKey;
import com.transempiric.transAuth.enums.TransAuthTokenType;
import com.transempiric.transAuth.error.TransAuthExpiredException;
import com.transempiric.transAuth.error.TransAuthInvalidException;
import com.transempiric.webTemplate.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Clock;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.DefaultClock;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class TransAuthTokenService {

    private static final String AUDIENCE = "app";

    private final Clock clock = DefaultClock.INSTANCE;
    private final String appName;
    private final String authTokenSecret;
    private final String refreshTokenSecret;
    private final Long authTokenExpiration;
    private final Long refreshTokenExpiration;
    private final String authHeaderName;
    private final String authHeaderPrefix;

    public TransAuthTokenService(Environment env) {
        Assert.notNull(env.getProperty("transempiric.app.name"), "transempiric.app.name property cannot be null");
        Assert.notNull(env.getProperty("transempiric.app.jwt.auth.token.secret"), "transempiric.app.jwt.auth.token.secret property cannot be null");
        Assert.notNull(env.getProperty("transempiric.app.jwt.refresh.token.secret"), "transempiric.app.jwt.refresh.token.secret property cannot be null");
        Assert.notNull(env.getProperty("transempiric.app.jwt.auth.token.expiration"), "transempiric.app.jwt.auth.token.expiration property cannot be null");
        Assert.notNull(env.getProperty("transempiric.app.jwt.refresh.token.expiration"), "transempiric.app.jwt.refresh.token.expiration property cannot be null");
        Assert.notNull(env.getProperty("transempiric.app.jwt.header.name"), "transempiric.app.jwt.header.name property cannot be null");
        Assert.notNull(env.getProperty("transempiric.app.jwt.header.prefix"), "transempiric.app.jwt.header.prefix property cannot be null");

        this.appName = env.getProperty("transempiric.app.name");
        this.authTokenSecret = env.getProperty("transempiric.app.jwt.auth.token.secret");
        this.refreshTokenSecret = env.getProperty("transempiric.app.jwt.refresh.token.secret");
        this.authTokenExpiration = env.getProperty("transempiric.app.jwt.auth.token.expiration", Long.class, null);
        this.refreshTokenExpiration = env.getProperty("transempiric.app.jwt.refresh.token.expiration", Long.class, null);
        this.authHeaderName = env.getProperty("transempiric.app.jwt.header.name");
        this.authHeaderPrefix = env.getProperty("transempiric.app.jwt.header.prefix");
    }

    /**
     * *******************************************************
     * ********************* Token **************************
     * *******************************************************
     */

    /* Extensible to JWE with RsaEncryptor */
    public String generateToken(UserDetails userDetails, TransAuthTokenType transAuthTokenType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TransAuthClaimKey.CLAIM_KEY_JWT_TOKEN_TYPE.key(), transAuthTokenType);
        return createToken(claims, userDetails.getUsername(), transAuthTokenType);
    }

    private String createToken(Map<String, Object> claims, String subject, TransAuthTokenType transAuthTokenType) {
        final Date createdDate = clock.now();
        final Date expirationDate = createExpirationDate(createdDate, transAuthTokenType);

        String secret = null;
        switch (transAuthTokenType) {
            case AUTH:
                secret = authTokenSecret;
                break;
            case REFRESH:
                secret = refreshTokenSecret;
                break;
        }

        return Jwts.builder()
                .setIssuer(appName)
                .setClaims(claims)
                .setSubject(subject)
                .setAudience(AUDIENCE)
                .setIssuedAt(createdDate)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }


    /**
     * *******************************************************
     * ********************* Claim Getters ****************
     * *******************************************************
     */


    public String getUsernameFromToken(String token, TransAuthTokenType transAuthTokenType) {
        return getClaimFromToken(token, transAuthTokenType, Claims::getSubject);
    }

    public Date getIssuedAtDateFromToken(String token, TransAuthTokenType transAuthTokenType) {
        return getClaimFromToken(token, transAuthTokenType, Claims::getIssuedAt);
    }

    public Date getExpirationDateFromToken(String token, TransAuthTokenType transAuthTokenType) {
        return getClaimFromToken(token, transAuthTokenType, Claims::getExpiration);
    }

    public String getAudienceFromToken(String token, TransAuthTokenType transAuthTokenType) {
        return getClaimFromToken(token, transAuthTokenType, Claims::getAudience);
    }


    public <T> T getClaimFromToken(String token, TransAuthTokenType transAuthTokenType, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token, transAuthTokenType);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token, TransAuthTokenType transAuthTokenType) {
        String secret = null;
        switch (transAuthTokenType) {
            case AUTH:
                secret = authTokenSecret;
                break;
            case REFRESH:
                secret = refreshTokenSecret;
                break;
                default:
                    throw new TransAuthInvalidException("Invalid TransAuthTokenType, can not determine secret");
        }

        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * *******************************************************
     * ********************* Validation **********************
     * *******************************************************
     */

    public Boolean validateToken(String token, TransAuthTokenType transAuthTokenType, UserDetails userDetails) {
        User user = (User) userDetails;
        return validateToken(token, transAuthTokenType, user.getUsername(), user.getLastPasswordResetDate());
    }

    public Boolean validateToken(String token, TransAuthTokenType transAuthTokenType, String username, Date lastPasswordResetDate) {
        final String tokenUsername = getUsernameFromToken(token, transAuthTokenType);
        final Date created = getIssuedAtDateFromToken(token, transAuthTokenType);

        if (tokenUsername == null) throw new TransAuthInvalidException("Could not parse username.");
        if (!username.equals(tokenUsername)) throw new TransAuthInvalidException("Username mismatch.");
        if (isTokenExpired(token, transAuthTokenType)) throw new TransAuthExpiredException();
        if (isCreatedBeforeLastPasswordReset(created, lastPasswordResetDate))
            throw new TransAuthExpiredException("Token was created before the last password reset.");

        return true;
    }

    private Boolean isTokenExpired(String token, TransAuthTokenType transAuthTokenType) {
        final Date expiration = getExpirationDateFromToken(token, transAuthTokenType);
        return expiration.before(clock.now());
    }

    private Boolean isCreatedBeforeLastPasswordReset(Date created, Date lastPasswordReset) {
        return (lastPasswordReset != null && created.before(lastPasswordReset));
    }

    private Boolean ignoreTokenExpiration(String token) {
        //TODO:  Use this for developer environment
        return false;
    }

    /**
     * *******************************************************
     * ********************* Utils ***************************
     * *******************************************************
     */

    // Getting the token from Authentication header, e.g Bearer
    public String getToken(HttpServletRequest request) {
        String authHeader = getAuthHeader(request);

        if (authHeader != null && authHeader.startsWith(authHeaderPrefix)) {
            return authHeader.substring(7);
        }

        return null;
    }

    private String getAuthHeader(HttpServletRequest request) {
        return request.getHeader(authHeaderName);
    }

    private Date createExpirationDate(Date createdDate, TransAuthTokenType transAuthTokenType) {
        Date expirationDate = null;
        switch (transAuthTokenType) {
            case AUTH:
                expirationDate = new Date(createdDate.getTime() + authTokenExpiration * 1000);
                break;
            case REFRESH:
                expirationDate = new Date(createdDate.getTime() + refreshTokenExpiration * 1000);
                break;
        }

        return expirationDate;
    }

    public Long getExpiresOn(String token, TransAuthTokenType transAuthTokenType) {
        Date expiration = getClaimFromToken(token, transAuthTokenType, Claims::getExpiration);
        System.out.println("getExpiresOn:" + expiration);
        return expiration.getTime();
    }
}