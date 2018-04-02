package com.transempiric.webTemplate.web.controller;

import com.transempiric.webTemplate.repository.BeerRepository;
import com.transempiric.webTemplate.viewState.ViewState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
@RequestMapping(value = "/beer")
public class BeerController {
    private final BeerRepository repository;
    private final ViewState viewState;

    @Autowired
    public BeerController(BeerRepository repository, ViewState viewState) {
        this.repository = repository;
        this.viewState = viewState;
    }

    @RequestMapping(value = "/**", method = GET)
    public String index(Model model, HttpServletRequest request) {
        viewState.populateModel(model, request);
        model.addAttribute("beer", getBeerState());
        return "index";
    }

    private Map<String, Object> getBeerState() {
        Map<String, Object> state = new HashMap<>();
        state.put("status", "loaded");
        state.put("data", repository.findAll());
        return state;
    }
}
