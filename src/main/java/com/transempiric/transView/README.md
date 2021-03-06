# TransView
> Java Nashorn View Template Module for Spring. Includes thread safe dynamically allocating Nashorn Resource Pool with warm up option.

- Uses Blocking Queue Resource Pool with Reentrant Lock and Dynamic Engine Creation
- TransViewTemplateView.java: New Spring Template Integration
- TransViewTemplateViewResolver.java: New Spring Template Integration 
- TransViewTemplateConfigurer.java - New Spring Integration
- TransViewAssetManifest.java: Reads a JSON asset manifest file

## Trans View Options

As seen in `webTemplate/config/web/MvcConfig.java`

```
    /**
     * Configure Spring to use a single place holder template.
     * Spring will use index.tvpl as a template for every view, but
     * actual rendering will use replace contents via ssr.js and Nashorn.
     * The contents of trans-view-index.tvpl are ignored.
     * Note: ".tvpl" is an arbitrary extension and has no significance.
     */
    @Bean
    public ViewResolver reactViewResolver() {
        TransViewTemplateViewResolver viewResolver = new TransViewTemplateViewResolver();
        viewResolver.setPrefix("templates/");
        viewResolver.setSuffix(".tvpl");

        return viewResolver;
    }

    /**
     * Configure the {@link NashornTransViewResourcePool} via the TransViewTemplateConfigurer.
     * Intentionally verbose to provide example. Required configuration is 2 parameters.
     */
    @Bean
    public TransViewTemplateConfigurer transViewConfigurer() {
        return new TransViewTemplateConfigurer()
                /*
                 ***********************************************************
                 **************** charset  *********************************
                 * The charset used to read script and template files.
                 * OPTIONAL
                 * Default: UTF-8
                 ***********************************************************/
                .setCharset(StandardCharsets.UTF_8)

                /*
                 ***********************************************************
                 **************** contentType  *****************************
                 * Content type to use for the response.
                 * OPTIONAL
                 * Default: "text/html"
                 ***********************************************************/
                .setContentType("text/html")

                /*
                 ***********************************************************
                 **************** dynamicEngineCreation  *******************
                 * If true, the Resource Pool will create additional
                 * Nashorn Engines when available engines are low.
                 * OPTIONAL
                 * Default: true
                 **********************************************************/
                .setDynamicEngineCreation(true)

                /*
                 ***********************************************************
                 **************** initRenderFunction  **********************
                 * If true, the Resource Pool will warm up the initial
                 * Nashorn Engines by calling the calling the render
                 * the render function after engine creation.
                 * Note: For awesome performance, keep true.
                 * OPTIONAL
                 * Default: true
                 ***********************************************************/
                .setInitRenderFunction(true)

                /*
                 ***********************************************************
                 **************** initialPoolSize  *************************
                 * The number of Nashorn Engines created on application
                 * start up.
                 * Note: "setInitialPoolSize" and "setInitRenderFunction"
                 * will affect the time it takes to start your application.
                 * OPTIONAL
                 * Default: 2
                 ***********************************************************/
                .setInitialPoolSize(2)

                /*
                 ***********************************************************
                 **************** maxPoolSize  *****************************
                 * The number of Nashorn Engines that can be dynamically
                 * created.
                 * Note: The engine pool needs to get hit hard for it to
                 * create an engine dynamically, but don'worry... It will.
                 * OPTIONAL
                 * Default: 5
                 ***********************************************************/
                .setMaxPoolSize(5)

                /*
                 ***********************************************************
                 **************** renderFunction  **************************
                 * Javascript function for Spring to call when rendering
                 * views.
                 * REQUIRED
                 ***********************************************************/
                .setRenderFunction("render")

                /*
                 ***********************************************************
                 **************** resourceLoader  **************************
                 * Spring ResourceLoader for retrieving JavaScript Files
                 * and templates.
                 * OPTIONAL
                 * Default: new DefaultResourceLoader()
                 ***********************************************************/
                .setResourceLoader(this.resourceLoader)

                /*
                 ***********************************************************
                 **************** resourceLoaderPath  **********************
                 * Spring Convention, used as prefix when loading templates
                 * and Javascript files with a ResourceLoader.
                 * e.g. "file:" | "http:" | "classpath:" | none
                 * OPTIONAL
                 * Default: "classpath:"
                 ***********************************************************/
                .setResourceLoaderPath("classpath:")

                /*
                 ***********************************************************
                 **************** showPoolStatsCSV  ************************
                 * Logs Resource Pool info to System.out.
                 * Tires to keep things near a CSV format for analysis
                 * Note: showPoolStatsCSV and showPoolStatsLOG can not both
                 * be set to true.
                 * OPTIONAL
                 * Default: false
                 ***********************************************************/
                .setShowPoolStatsCSV(false)

                /*
                 ***********************************************************
                 **************** showPoolStatsLOG  ************************
                 * Logs Resource Pool info to System.out.
                 * Pretty prints.
                 * Note: showPoolStatsCSV and showPoolStatsLOG can not both
                 * be set to true.
                 * OPTIONAL
                 * Default: false
                 ***********************************************************/
                .setShowPoolStatsLOG(false)

                /*
                 ***********************************************************
                 **************** transViewAssetManifest  ******************
                 * A TransViewAssetManifest object.
                 * A path to a JSON formatted asset manifest file can be
                 * used via constructor argument. Scripts can be added with
                 * a manifest key "addScriptKey" or a resource path
                 * "addScriptPath".  The "addScript*" methods require a
                 * precedence parameter for each addition.
                 * The scripts will be evaluated by Nashorn in ascending
                 * order of their precedence (1, 2, 3. ...).
                 ***********************************************************/
                .setTransViewAssetManifest(
                        new TransViewAssetManifest("static/asset-manifest.json")
                                .addScriptPath("static/js/ssr/ssr.js", 1) // Adding server-side renderer first via path
                                .addScriptKey("main.js", 2) // Adding react app via  manifest key
                )

                /* The build method must be called to start Resource Pool creation */
                .build();
    }
```

## Notes:
More documentation to come.
