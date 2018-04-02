package com.transempiric.webTemplate.repository;

import com.transempiric.webTemplate.model.Beer;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BeerRepository extends JpaRepository<Beer, Long> {
    Beer findByName(String name);
}
