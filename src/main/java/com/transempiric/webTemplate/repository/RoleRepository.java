package com.transempiric.webTemplate.repository;

import com.transempiric.webTemplate.model.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Authority, Long> {

    Authority findByName(String name);

    @Override
    void delete(Authority role);

}
