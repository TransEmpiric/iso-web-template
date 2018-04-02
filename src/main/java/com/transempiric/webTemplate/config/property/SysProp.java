package com.transempiric.webTemplate.config.property;

public class SysProp {
    private static final String DEFAULT_SYS_PROP_ENV  = "dev";
    private static final String DEFAULT_SYS_PROP_INST = "dev-1";

    private static SysProp INSTANCE = null;

    private SysProp() {}
    private String env;
    private String inst;

    public static SysProp get() {
        if (INSTANCE == null) {
            synchronized (SysProp.class) {
                if (INSTANCE == null) {
                    INSTANCE = new SysProp();
                }
            }
        }

        return INSTANCE;
    }

    public static String fetch(String name) {
        return System.getProperty(name);
    }

    public String env() {
        if (INSTANCE.env == null || DEFAULT_SYS_PROP_ENV.equals(INSTANCE.env)) INSTANCE.env = System.getProperty("env");
        if (INSTANCE.env == null) INSTANCE.env = DEFAULT_SYS_PROP_ENV;
        return INSTANCE.env;
    }

    public String inst() {
        if (INSTANCE.inst == null || DEFAULT_SYS_PROP_INST.equals(INSTANCE.inst)) INSTANCE.inst = System.getProperty("inst");
        if (INSTANCE.inst == null) INSTANCE.inst = DEFAULT_SYS_PROP_INST;
        return INSTANCE.inst;
    }

    public static String inst(String name) {
        return System.getProperty(name);
    }
}