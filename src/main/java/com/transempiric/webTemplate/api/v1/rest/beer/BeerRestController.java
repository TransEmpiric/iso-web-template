package com.transempiric.webTemplate.api.v1.rest.beer;

import com.transempiric.transView.utils.FunctionsUtil;
import com.transempiric.webTemplate.model.Beer;
import com.transempiric.webTemplate.repository.BeerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/api/rest/v1/beer", produces = APPLICATION_JSON_VALUE)
public class BeerRestController {

    private final BeerRepository repository;

    @Autowired
    public BeerRestController(BeerRepository repository) {
        this.repository = repository;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(method = POST)
    public Beer add(@RequestBody Beer beer) {
        return repository.save(beer);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping(method = GET)
    public List<Beer> beers() {
        // You shouldn't do this in a real app - you should page the data!
        return FunctionsUtil.map(repository.findAll(), beer -> beer);
    }
}
