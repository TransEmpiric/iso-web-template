package com.transempiric.webTemplate.api.v1.rest.account;

import com.transempiric.transView.utils.FunctionsUtil;
import com.transempiric.webTemplate.model.User;
import com.transempiric.webTemplate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping(value = "/api/rest/v1/user", produces = APPLICATION_JSON_VALUE)
public class UserRestController {
    private final UserRepository repository;

    @Autowired
    public UserRestController(UserRepository repository) {
        this.repository = repository;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(method = GET)
    public List<User> list() {
        // You shouldn't do this in a real app - you should page the data!
        return FunctionsUtil.map(repository.findAll(), user -> user);
    }
}
