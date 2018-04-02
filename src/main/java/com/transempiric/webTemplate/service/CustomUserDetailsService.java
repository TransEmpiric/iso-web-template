package com.transempiric.webTemplate.service;

import com.transempiric.transAuth.error.TransAuthUserNotFoundException;
import com.transempiric.webTemplate.model.Authority;
import com.transempiric.webTemplate.model.Privilege;
import com.transempiric.webTemplate.model.User;
import com.transempiric.webTemplate.model.UserBuilder;
import com.transempiric.webTemplate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service("userDetailsService")
@Transactional
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("unchecked")
    @Override
    public UserDetails loadUserByUsername(final String identity) throws UsernameNotFoundException {
        final User user = Optional.ofNullable(userRepository.findByEmail(identity)).orElseGet(() -> userRepository.findByUsername(identity));

        if (user == null) {
            throw new UsernameNotFoundException("No user found with username: " + identity);
        }

        //Collection<Authority> authorities = getAuthorities((Collection<Authority>) user.getAuthorities());
        Collection<Authority> authorities = getAuthorities((Collection<Authority>) user.getAuthorities());

        return new UserBuilder(user).bAuthorities(authorities).createUser();
    }

    private final Collection<Authority> getAuthorities(final Collection<Authority> authorityList) {
        return getGrantedAuthorities(getAuthorityList(authorityList));
    }

    private final List<String> getAuthorityList(final Collection<Authority> authorityList) {
        final List<String> authorities = new ArrayList<String>();

        for (final Authority authority : authorityList) {
            authorities.add(authority.getName());

            if (authority.getPrivileges() == null || authority.getPrivileges().isEmpty()) continue;

            // Add all Privileges as Authorities
            for (final Privilege item : authority.getPrivileges()) {
                authorities.add(item.getName());
            }
        }

        return authorities;
    }

    private final Collection<Authority> getGrantedAuthorities(final List<String> authorityList) {
        final List<Authority> grantedAuthorities = new ArrayList<Authority>();
        for (final String authority : authorityList) {
            grantedAuthorities.add(new Authority(authority));
        }
        return grantedAuthorities;
    }
}