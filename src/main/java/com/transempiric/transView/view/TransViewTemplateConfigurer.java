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

package com.transempiric.transView.view;

import com.transempiric.transView.pool.NashornTransViewResourcePool;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.lang.Nullable;
import org.springframework.util.Assert;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class TransViewTemplateConfigurer implements TransViewTemplateConfig {
    private final Log logger = LogFactory.getLog(this.getClass());

    private static final Charset DEFAULT_CHAR_SET = StandardCharsets.UTF_8;
    private static final String DEFAULT_CONTENT_TYPE = "text/html";
    private static final String DEFAULT_RESOURCE_LOADER_PATH = "classpath:";
    private static final int DEFAULT_INITIAL_POOL_SIZE = 2;
    private static final int DEFAULT_MAX_POOL_SIZE = 5;

    @Nullable
    private Charset charset;

    @Nullable
    private String contentType;

    @Nullable
    private Boolean dynamicEngineCreation;

    @Nullable
    private Boolean initRenderFunction;

    @Nullable
    private Integer initialPoolSize;

    @Nullable
    private Integer maxPoolSize;

    @Nullable
    private NashornTransViewResourcePool nashornTransViewResourcePool;

    @Nullable
    private String renderFunction;

    @Nullable
    private String renderObject;

    @Nullable
    private ResourceLoader resourceLoader;

    @Nullable
    private String resourceLoaderPath;

    @Nullable
    private Boolean showPoolStatsCSV;

    @Nullable
    private Boolean showPoolStatsLOG;

    @Nullable
    private TransViewAssetManifest transViewAssetManifest;

    private boolean poolCreated = false;

    /**
     * **********************************************
     * *************** Constructor ******************
     * **********************************************
     */

    public TransViewTemplateConfigurer() {
    }

    /**
     * **********************************************
     * *********** Getters and Setters **************
     * **********************************************
     */

    @Override
    @Nullable
    public TransViewAssetManifest getTransViewAssetManifest() {
        return transViewAssetManifest;
    }

    public TransViewTemplateConfigurer setTransViewAssetManifest(@Nullable TransViewAssetManifest transViewAssetManifest) {
        this.transViewAssetManifest = transViewAssetManifest;
        return this;
    }

    @Override
    @Nullable
    public Charset getCharset() {
        if (charset == null) charset = DEFAULT_CHAR_SET;
        return charset;
    }

    public TransViewTemplateConfigurer setCharset(@Nullable Charset charset) {
        this.charset = charset;
        return this;
    }

    @Override
    @Nullable
    public String getContentType() {
        if (contentType == null) contentType = DEFAULT_CONTENT_TYPE;
        return contentType;
    }

    public TransViewTemplateConfigurer setContentType(@Nullable String contentType) {
        this.contentType = contentType;
        return this;
    }

    @Override
    @Nullable
    public Boolean getDynamicEngineCreation() {
        if (dynamicEngineCreation == null) dynamicEngineCreation = true;
        return dynamicEngineCreation;
    }

    public TransViewTemplateConfigurer setDynamicEngineCreation(@Nullable Boolean dynamicEngineCreation) {
        this.dynamicEngineCreation = dynamicEngineCreation;
        return this;
    }

    @Override
    @Nullable
    public Boolean getInitRenderFunction() {
        if (initRenderFunction == null) initRenderFunction = false;
        return initRenderFunction;
    }

    public TransViewTemplateConfigurer setInitRenderFunction(@Nullable Boolean initRenderFunction) {
        this.initRenderFunction = initRenderFunction;
        return this;
    }

    @Override
    @Nullable
    public Integer getInitialPoolSize() {
        if (initialPoolSize == null) initialPoolSize = DEFAULT_INITIAL_POOL_SIZE;
        return initialPoolSize;
    }

    public TransViewTemplateConfigurer setInitialPoolSize(Integer initialPoolSize) {
        this.initialPoolSize = initialPoolSize;
        return this;
    }

    @Override
    @Nullable
    public Integer getMaxPoolSize() {
        if (maxPoolSize == null) maxPoolSize = DEFAULT_MAX_POOL_SIZE;
        return maxPoolSize;
    }

    public TransViewTemplateConfigurer setMaxPoolSize(Integer maxPoolSize) {
        this.maxPoolSize = maxPoolSize;
        return this;
    }

    @Override
    @Nullable
    public NashornTransViewResourcePool getNashornTransViewResourcePool() {
        validateConfig();
        return this.nashornTransViewResourcePool;
    }

    @Override
    @Nullable
    public String getRenderFunction() {
        return this.renderFunction;
    }

    public TransViewTemplateConfigurer setRenderFunction(@Nullable String renderFunction) {
        this.renderFunction = renderFunction;
        return this;
    }

    @Override
    @Nullable
    public String getRenderObject() {
        return this.renderObject;
    }

    public TransViewTemplateConfigurer setRenderObject(@Nullable String renderObject) {
        this.renderObject = renderObject;
        return this;
    }

    @Override
    @Nullable
    public ResourceLoader getResourceLoader() {
        if (resourceLoader == null) this.resourceLoader = new DefaultResourceLoader();
        return resourceLoader;
    }

    public TransViewTemplateConfigurer setResourceLoader(@Nullable ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
        return this;
    }

    @Override
    @Nullable
    public String getResourceLoaderPath() {
        if (resourceLoaderPath == null) resourceLoaderPath = DEFAULT_RESOURCE_LOADER_PATH;
        return this.resourceLoaderPath;
    }

    public TransViewTemplateConfigurer setResourceLoaderPath(@Nullable String resourceLoaderPath) {
        this.resourceLoaderPath = resourceLoaderPath;
        return this;
    }

    @Override
    @Nullable
    public Boolean getShowPoolStatsCSV() {
        if (showPoolStatsCSV == null) showPoolStatsCSV = false;
        return showPoolStatsCSV;
    }

    public TransViewTemplateConfigurer setShowPoolStatsCSV(@Nullable Boolean showPoolStatsCSV) {
        this.showPoolStatsCSV = showPoolStatsCSV;
        return this;
    }

    @Override
    @Nullable
    public Boolean getShowPoolStatsLOG() {
        if (showPoolStatsLOG == null) showPoolStatsLOG = false;
        return showPoolStatsLOG;
    }

    public TransViewTemplateConfigurer setShowPoolStatsLOG(@Nullable Boolean showPoolStatsLOG) {
        this.showPoolStatsLOG = showPoolStatsLOG;
        return this;
    }

    /**
     * **********************************************
     * *********** Resource Pool Creation ***********
     * **********************************************
     */

    /* Creates the Nashorn Engine Pool */
    private void createNashornTransViewResourcePool() {
        if (!poolCreated) {
            validateConfig();

            logger.warn("\n\nTransViewTemplateConfigurer: Creating the Nashorn Engine Pool..." + prettyToString());

            nashornTransViewResourcePool = new NashornTransViewResourcePool(this);
            poolCreated = true;
        } else {
            logger.warn("TransViewTemplateConfigurer: Whoops! createNashornTransViewResourcePool() was called, " +
                    "but a pool has already been created. Skipping pool creation.");
        }
    }

    /* Public build method calls the Nashorn Engine Pool creation method */
    public TransViewTemplateConfigurer build() {
        createNashornTransViewResourcePool();
        return this;
    }

    /**
     * **********************************************
     * ***************** Validation *****************
     * **********************************************
     */
    private void validateConfig() {
        Assert.hasLength(getRenderFunction(), "TransViewTemplateConfigurer: Invalid configuration, " +
                "renderFunction can not be null or empty.");

        Assert.notNull(getTransViewAssetManifest(), "TransViewTemplateConfigurer: Invalid configuration, " +
                "transViewAssetManifest can not be null.");

        Assert.notEmpty(getTransViewAssetManifest().getScripts(), "TransViewTemplateConfigurer: Invalid configuration, " +
                "transViewAssetManifest.scripts can not empty.");
    }

    /**
     * **********************************************
     * ***************** Utils *******************
     * **********************************************
     */
    private String prettyToString() {
        Assert.notNull(getTransViewAssetManifest(), "TransViewTemplateConfigurer: Invalid configuration, " +
                "transViewAssetManifest can not be null");

        return "\n\t{"
                + "\n\t\tdynamicEngineCreation: " + getDynamicEngineCreation() + ","
                + "\n\t\tinitRenderFunction: " + getInitRenderFunction() + ","
                + "\n\t\tinitialPoolSize: " + getInitialPoolSize() + ","
                + "\n\t\tmaxPoolSize: " + getMaxPoolSize() + ","
                + "\n\t\trenderFunction: " + getRenderFunction() + ","
                + "\n\t\trenderObject: " + getRenderObject() + ","
                + "\n\t\tresourceLoaderPath: " + getResourceLoaderPath() + ","
                + "\n\t\tshowPoolStatsCSV: " + getShowPoolStatsCSV() + ","
                + "\n\t\tshowPoolStatsLOG: " + getShowPoolStatsLOG() + ","
                + "\n\t\ttransViewAssetManifest: " + getTransViewAssetManifest().prettyToString()
                + "\n\t}" +
                "\n\n";
    }
}