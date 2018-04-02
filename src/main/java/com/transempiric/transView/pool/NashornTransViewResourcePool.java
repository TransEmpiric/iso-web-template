/*
 * MIT License
 *
 * Copyright (c) 2018 Transempiric
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package com.transempiric.transView.pool;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.transempiric.transView.utils.ResourceUtil;
import com.transempiric.transView.view.TransViewAssetManifest;
import com.transempiric.transView.view.TransViewTemplateConfigurer;
import jdk.nashorn.api.scripting.NashornScriptEngine;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.Assert;
import org.springframework.web.servlet.view.script.RenderingContext;

import javax.script.ScriptEngineManager;
import javax.script.SimpleBindings;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NashornTransViewResourcePool extends TransViewResourcePool<TransViewResourceWrapper<NashornScriptEngine>> {
    private final Log logger = LogFactory.getLog(this.getClass());

    private static final String NASHORN_SHORT_NAME = "nashorn";

    private Boolean initRenderFunction;
    private String renderFunction;
    private ObjectMapper objectMapper;
    private ResourceLoader resourceLoader;
    private Charset charset;
    private String[] resourceLoaderPaths;
    private List<String> scriptPaths;
    private TransViewAssetManifest transViewAssetManifest;

    /**
     * ************************************************
     * ***************** Constructor ******************
     * ***********************************************
     */

    public NashornTransViewResourcePool(TransViewTemplateConfigurer config) {
        super(
                config.getInitialPoolSize(),
                config.getMaxPoolSize(),
                config.getDynamicEngineCreation(),
                config.getShowPoolStatsCSV(),
                config.getShowPoolStatsLOG()
        );

        this.renderFunction = config.getRenderFunction();
        this.initRenderFunction = config.getInitRenderFunction();
        this.transViewAssetManifest = config.getTransViewAssetManifest();
        this.resourceLoader = config.getResourceLoader();
        this.resourceLoaderPaths = ResourceUtil.getResourceLoaderPaths(config.getResourceLoaderPath());
        this.objectMapper = getObjectMapper();
        this.scriptPaths = getScriptsFromTransViewAssetManifest();
        this.charset = config.getCharset();

        createPool();
    }

    /**
     * *****************************************************
     * ****** Create Object method for resource pool *******
     * *** This method creates NashornScriptEngines ********
     * *** within a TransViewResourceWrapper        ********
     * *****************************************************
     */

    @Override
    protected TransViewResourceWrapper<NashornScriptEngine> createObject() {
        NashornScriptEngine nashornScriptEngine = (NashornScriptEngine) new ScriptEngineManager().getEngineByName(NASHORN_SHORT_NAME);

        for (String scriptPath : scriptPaths) {
            try {
                nashornScriptEngine.eval(ResourceUtil.read(resourceLoader, resourceLoaderPaths, charset, scriptPath));
            } catch (Throwable ex) {
                throw new IllegalStateException("NashornTransViewResourcePool: Failed to evaluate script [" + scriptPath + "]", ex);
            }
        }

        if (initRenderFunction && renderFunction != null) {
            try {
                nashornScriptEngine.invokeFunction(renderFunction);
            } catch (Throwable ex) {
                throw new IllegalStateException("NashornTransViewResourcePool: Failed to initialize renderFunction [" + renderFunction + "]", ex);
            }
        }

        return new TransViewResourceWrapper<>(nashornScriptEngine);
    }

    /**
     * **********************************************
     * ************* JavaScript Eval  ***************
     * **********************************************
     */

    public Object evalTemplateBindings(String template, SimpleBindings bindings) throws Exception {
        TransViewResourceWrapper<NashornScriptEngine> resourceWrapper = acquire();
        NashornScriptEngine nashornScriptEngine = resourceWrapper.getObject();
        try {
            return nashornScriptEngine.eval(template, bindings);
        } finally {
            recycle(resourceWrapper);
        }
    }

    public Object invokeFunction(String renderFunction, String template, Map<String, Object> model, RenderingContext context) throws Exception {
        TransViewResourceWrapper<NashornScriptEngine> resourceWrapper = acquire();
        NashornScriptEngine nashornScriptEngine = resourceWrapper.getObject();
        try {
            return nashornScriptEngine.invokeFunction(renderFunction, template, model, context);
        } finally {
            recycle(resourceWrapper);
        }
    }

    // TODO:  Have not tested this method with renderObject
    public Object evalObject(String renderObject) throws Exception {
        TransViewResourceWrapper<NashornScriptEngine> resourceWrapper = acquire();
        NashornScriptEngine nashornScriptEngine = resourceWrapper.getObject();
        try {
            return nashornScriptEngine.eval(renderObject);
        } finally {
            recycle(resourceWrapper);
        }
    }

    // TODO:  Have not tested this method with renderObject
    public Object invokeFunctionWithRenderObject(Object renderObject, String renderFunction,
                                                 String template, Map<String, Object> model,
                                                 RenderingContext context) throws Exception {

        TransViewResourceWrapper<NashornScriptEngine> resourceWrapper = acquire();
        NashornScriptEngine nashornScriptEngine = resourceWrapper.getObject();

        try {
            return nashornScriptEngine.invokeFunction((String) renderObject, renderFunction, template, model, context);
        } finally {
            recycle(resourceWrapper);
        }
    }

    /**
     * *********************************************
     * *** TransViewAssetManifest Helpers files ****
     * *********************************************
     */

    /* Get scripts from the  TransViewAssetManifest object */
    private List<String> getScriptsFromTransViewAssetManifest() {
        List<String> scriptPathList = new ArrayList<>();
        Resource manifestResource;
        Map<String, String> manifestResourceContent = null;

        /* Read the  asset manifest resource */
        if (transViewAssetManifest.getJsonManifestPath() != null) {
            manifestResource = ResourceUtil.getResource(resourceLoader, resourceLoaderPaths, transViewAssetManifest.getJsonManifestPath());

            Assert.isTrue(manifestResource.exists(), "Invalid TransViewAssetManifest configuration, " +
                    "could not find asset manifest resource, " +
                    "(" + transViewAssetManifest.getJsonManifestPath() + ").");

            try {
                manifestResourceContent = objectMapper.readValue(manifestResource.getFile(), new TypeReference<HashMap<String, String>>() {
                });
            } catch (IOException e) {
                logger.error("Invalid TransViewAssetManifest configuration, " +
                        "could not read JSON Manifest Resource. " +
                        "Please make sure the asset manifest contains valid JSON, {key: pathToResource}.", e);
            }
        }

        /* Find all script paths asset manifest resource */
        for (TransViewAssetManifest.Script script : transViewAssetManifest.getScripts()) {
            switch (script.getLookUpType()) {
                case JSON_MANIFEST:
                    if (manifestResourceContent == null || manifestResourceContent.isEmpty()) break;
                    scriptPathList.add(manifestResourceContent.get(script.getJsonManifestKey()));
                    break;
                case RESOURCE_PATH:
                    scriptPathList.add(script.getResourcePath());
                    break;
                default:
                    logger.warn("Invalid TransViewAssetManifest configuration, invalid Script LookUpType.");
                    break;
            }
        }

        Assert.notEmpty(scriptPathList, "Invalid TransViewAssetManifest configuration, no scripts found.");
        return scriptPathList;
    }

    /* Create ObjectMapper to read the asset manifest JSON file */
    private ObjectMapper getObjectMapper() {
        return new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(MapperFeature.DEFAULT_VIEW_INCLUSION, true);
    }
}