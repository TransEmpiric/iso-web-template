package com.transempiric.webTemplate.api.v1.common.response;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class AppObjectMapper extends ObjectMapper {
    private static final long serialVersionUID = 1L;

    public AppObjectMapper() {
        configure(MapperFeature.DEFAULT_VIEW_INCLUSION, true);

        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        configure(SerializationFeature.INDENT_OUTPUT, true);

        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        setDateFormat(df);
        configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        // setSerializationInclusion(Include.NON_NULL);
    }
}
