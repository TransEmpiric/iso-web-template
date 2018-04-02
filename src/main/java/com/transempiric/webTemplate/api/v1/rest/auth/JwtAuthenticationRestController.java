package com.transempiric.webTemplate.api.v1.rest.auth;

import com.transempiric.transAuth.token.TransAuthAuthenticationRequest;
import com.transempiric.transAuth.token.TransAuthAuthenticationResponse;
import com.transempiric.transAuth.token.TransAuthRefreshRequest;
import com.transempiric.webTemplate.service.TransAuthenticationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class JwtAuthenticationRestController {
    @Autowired
    private TransAuthenticationServiceImpl jwtAuthenticationServiceImpl;

    @RequestMapping(value = "/token", method = RequestMethod.POST)
    public ResponseEntity<TransAuthAuthenticationResponse> create(@RequestBody TransAuthAuthenticationRequest transAuthAuthenticationRequest, HttpServletResponse response) throws AuthenticationException {
        return ResponseEntity.ok(jwtAuthenticationServiceImpl.authenticate(transAuthAuthenticationRequest));
    }

    @RequestMapping(value = "/refresh", method = RequestMethod.POST)
    public ResponseEntity<TransAuthAuthenticationResponse> refresh(@RequestBody TransAuthRefreshRequest transAuthRefreshRequest, HttpServletResponse response) throws AuthenticationException {
        return ResponseEntity.ok(jwtAuthenticationServiceImpl.refresh(transAuthRefreshRequest));
    }
}