package com.transempiric.webTemplate.service;

import com.transempiric.webTemplate.model.Beer;
import com.transempiric.webTemplate.repository.BeerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BeerService {

    @Autowired
    private BeerRepository beerRepository;

    @Transactional
    public void save(Beer beer) {
        beerRepository.save(beer);
    }

    @Transactional(readOnly = true)
    public Iterable<Beer> list() {
        return beerRepository.findAll();
    }

}
