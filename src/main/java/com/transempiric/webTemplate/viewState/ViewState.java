package com.transempiric.webTemplate.viewState;

import com.transempiric.transView.view.TransViewAbstractState;
import com.transempiric.webTemplate.config.property.SysProp;
import com.transempiric.webTemplate.repository.BeerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service
public class ViewState extends TransViewAbstractState {
    private final BeerRepository beerRepository;

    @Autowired
    public ViewState(BeerRepository beerRepository) {
        this.beerRepository = beerRepository;
    }

    @Override
    public void getState(Model model, HttpServletRequest request) {
        model.addAttribute("app", getAppState());
        model.addAttribute("auth", getAuthState(request));
        model.addAttribute("beer", getBeerState());
    }

    /**
     * Returns a representation of app state, in the shape expected by the client.
     */
    public Map<String, Object> getAppState() {
        Map<String, Object> appState = new HashMap<>();
        appState.put("env", SysProp.get().env());
        appState.put("inst", SysProp.get().inst());
        appState.put("busy", false);
        return appState;
    }

    /**
     * Returns the beer state.
     * Method Lever; Security can be added,  as well as the Controler level.
     */
    public Map<String, Object> getBeerState() {
        Map<String, Object> beerState = new HashMap<>();
        beerState.put("status", "loaded");
        beerState.put("data", beerRepository.findAll());
        return beerState;
    }

    /**
     * Returns user's authentication state.
     */
    public Map<String, Object> getAuthState(HttpServletRequest request) {
        Optional<List<String>> optionalAuthorities = getAuthorities(request);
        return optionalAuthorities.map(authorities -> {
            Map<String, Object> authState = new HashMap<>();
            authState.put("signedIn", !authorities.contains("ROLE_ANONYMOUS"));
            authState.put("authLoadState", "AUTH_LOAD_STATE_NOT_STARTED");
            authState.put("isBadCredentials", false);
            authState.put("getAuthorities", authorities);
            return authState;
        }).orElseGet(() -> {
            Map<String, Object> authState = new HashMap<>();
            authState.put("signedIn", false);
            authState.put("authLoadState", "AUTH_LOAD_STATE_NOT_STARTED");
            authState.put("isBadCredentials", false);
            authState.put("authorities", Collections.singletonList("ROLE_ANONYMOUS"));
            return authState;
        });
    }
}
