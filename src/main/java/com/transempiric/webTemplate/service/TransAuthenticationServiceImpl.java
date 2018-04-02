package com.transempiric.webTemplate.service;

import com.transempiric.transAuth.enums.TransAuthTokenType;
import com.transempiric.transAuth.error.TransAuthInvalidException;
import com.transempiric.transAuth.error.TransAuthMissingException;
import com.transempiric.transAuth.error.TransAuthUserNotFoundException;
import com.transempiric.transAuth.token.TransAuthAuthenticationRequest;
import com.transempiric.transAuth.token.TransAuthAuthenticationResponse;
import com.transempiric.transAuth.token.TransAuthRefreshRequest;
import com.transempiric.transAuth.service.TransAuthenticationService;
import com.transempiric.transAuth.service.TransAuthTokenService;
import com.transempiric.webTemplate.model.User;
import com.transempiric.webTemplate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;


/* TODO: Use UserDetails and UserDetailsService only, no application dependencies */
@Service
public class TransAuthenticationServiceImpl implements TransAuthenticationService {

    @Autowired
    TransAuthTokenService transAuthTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    public TransAuthAuthenticationResponse authenticate(final TransAuthAuthenticationRequest transAuthAuthenticationRequest) {
        // Perform Authentication
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        transAuthAuthenticationRequest.getUsername(),
                        transAuthAuthenticationRequest.getPassword()
                )
        );

        // Inject into security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // User Details
        final User user = (User) authentication.getPrincipal();
        final Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Token creation
        final String token = transAuthTokenService.generateToken(user, TransAuthTokenType.AUTH);
        final String refreshToken = transAuthTokenService.generateToken(user, TransAuthTokenType.REFRESH);

        // Build the response
        return new TransAuthAuthenticationResponse()
                .username(user.getUsername())
                .authorities(authorities)
                .authToken(token)
                .refreshToken(refreshToken)
                .authTokenExpiresOn(transAuthTokenService.getExpiresOn(token, TransAuthTokenType.AUTH))
                .refreshTokenExpiresOn(transAuthTokenService.getExpiresOn(refreshToken, TransAuthTokenType.REFRESH));
    }

    public TransAuthAuthenticationResponse refresh(final TransAuthRefreshRequest transAuthRefreshRequest) {
        String username = transAuthRefreshRequest.getUsername();
        String refreshToken = transAuthRefreshRequest.getRefreshToken();

        // Some cost saving validation, but it is not absolutely necessary
        if (username == null) throw new TransAuthInvalidException("Username is missing.");
        if (refreshToken == null) throw new TransAuthMissingException("Refresh token is missing.");

        // Get User and not UserDetails so Privileges are mapped to Authorities in resulting JSON
        // Our User implements UserDetails
        User user = userRepository.findByUsername(username);

        // Check if we have a valid User
        if (user == null) throw new TransAuthUserNotFoundException("User was not found (" + username + ")");

        // Get Authorities
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Token creation
        String newToken = transAuthTokenService.generateToken(user, TransAuthTokenType.AUTH);
        String newRefreshToken = transAuthTokenService.generateToken(user, TransAuthTokenType.REFRESH);

        // Build the response
        return new TransAuthAuthenticationResponse()
                .username(user.getUsername())
                .authorities(authorities)
                .authToken(newToken)
                .authTokenExpiresOn(transAuthTokenService.getExpiresOn(newToken, TransAuthTokenType.AUTH))
                .refreshToken(newRefreshToken)
                .refreshTokenExpiresOn(transAuthTokenService.getExpiresOn(newRefreshToken, TransAuthTokenType.REFRESH));
    }
}