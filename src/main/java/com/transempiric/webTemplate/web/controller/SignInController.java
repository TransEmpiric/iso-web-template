package com.transempiric.webTemplate.web.controller;

import com.transempiric.webTemplate.viewState.ViewState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Renders the signIn page.
 */
@Controller
public class SignInController {
    private final ViewState viewState;

    @Autowired
    public SignInController(ViewState viewState) {
        this.viewState = viewState;
    }

    @RequestMapping(value = "/signIn", method = GET)
    public String index(Model model, HttpServletRequest request) {
        viewState.populateModel(model, request);
        return "index";
    }
}
