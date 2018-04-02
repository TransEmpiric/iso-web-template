package com.transempiric.webTemplate.web.controller;

import com.transempiric.webTemplate.viewState.ViewState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Controller
@RequestMapping("/error")
public class ErrorController extends AbstractErrorController {

    private final ServerProperties serverProperties;
    private final ViewState viewState;

    @Autowired
    public ErrorController(ErrorAttributes errorAttributes, ServerProperties serverProperties, ViewState viewState) {
        super(errorAttributes);
        this.serverProperties = serverProperties;
        this.viewState = viewState;
    }

    @RequestMapping(produces = "text/html")
    public String errorHtml(Model model, HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(getStatus(request).value());
        model.addAttribute("errors", getErrorAttributes(request, isIncludeStackTrace(request)));
        viewState.populateModel(model, request);
        return "index";
    }

    @RequestMapping
    @ResponseBody
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        Map<String, Object> body = getErrorAttributes(request, isIncludeStackTrace(request));
        HttpStatus status = getStatus(request);
        return new ResponseEntity<>(body, status);
    }

    @Override
    public String getErrorPath() {
        return this.serverProperties.getError().getPath();
    }

    protected boolean isIncludeStackTrace(HttpServletRequest request) {
        ErrorProperties.IncludeStacktrace include = serverProperties.getError().getIncludeStacktrace();
        if (include == ErrorProperties.IncludeStacktrace.ALWAYS) {
            return true;
        }
        if (include == ErrorProperties.IncludeStacktrace.ON_TRACE_PARAM) {
            return getTraceParameter(request);
        }
        return false;
    }
}