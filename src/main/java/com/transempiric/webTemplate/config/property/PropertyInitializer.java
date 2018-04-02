package com.transempiric.webTemplate.config.property;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.io.Resource;

public class PropertyInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    private final Log logger = LogFactory.getLog(this.getClass());

    private static final String DEFAULT_RESOURCE_PREFIX      = "config/";
    private static final String DEFAULT_RESOURCE_PATH_COMMON = DEFAULT_RESOURCE_PREFIX + "common/common-environment.yml";
    private static final String DEFAULT_RESOURCE_SUFFIX_ENV  = "-environment.yml";
    private static final String DEFAULT_RESOURCE_SUFFIX_INST = "-instance.yml";
    private static final String DEFAULT_INST     = "-instance.yml";
    private static final String DEFAULT_ENV_PROP_NAME = "-instance.yml";

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        try {
            MutablePropertySources mutablePropertySources = applicationContext.getEnvironment().getPropertySources();
            YamlPropertySourceLoader sourceLoader = new YamlPropertySourceLoader();

            String commonPropertiesPath = DEFAULT_RESOURCE_PATH_COMMON;
            String envPropertiesPath = DEFAULT_RESOURCE_PREFIX + SysProp.get().env() + "/" + SysProp.get().env() + DEFAULT_RESOURCE_SUFFIX_ENV;
            String instPropertiesPath = DEFAULT_RESOURCE_PREFIX + SysProp.get().env() + "/" + SysProp.get().inst() + DEFAULT_RESOURCE_SUFFIX_INST;

            Resource commonResource = applicationContext.getResource(commonPropertiesPath);
            Resource environmentResource = applicationContext.getResource(envPropertiesPath);
            Resource instanceResource = applicationContext.getResource(instPropertiesPath);

            if (commonResource.exists()) {
                mutablePropertySources.addFirst(sourceLoader.load("commonProperties", commonResource, null));
            } else {
                warn(commonPropertiesPath);
            }

            if (environmentResource.exists()) {
                mutablePropertySources.addFirst(sourceLoader.load("environmentProperties", environmentResource, null));
            } else {
                warn(envPropertiesPath);
            }

            if (instanceResource.exists()) {
                mutablePropertySources.addFirst(sourceLoader.load("instanceProperties", instanceResource, null));
            } else {
                warn(instPropertiesPath);
            }

        } catch (Exception e) {
            throw new RuntimeException("PropertyInitializer Error: Could not initialize application properties.");
        }
    }

    private void warn(String path) {
        logger.warn("PropertyInitializer Warning: Could not find properties resource (" + path + ").");
    }
}