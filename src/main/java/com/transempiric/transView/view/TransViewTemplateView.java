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
import com.transempiric.transView.utils.ResourceUtil;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextException;
import org.springframework.core.io.ResourceLoader;
import org.springframework.lang.Nullable;
import org.springframework.scripting.support.StandardScriptEvalException;
import org.springframework.util.Assert;
import org.springframework.web.servlet.support.RequestContextUtils;
import org.springframework.web.servlet.view.AbstractUrlBasedView;
import org.springframework.web.servlet.view.script.RenderingContext;

import javax.script.ScriptException;
import javax.script.SimpleBindings;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Function;

/**
 * An {@link AbstractUrlBasedView} subclass designed to run any template library
 * based on a JSR-223 script engine. With a thread safe script engine pool.
 * <p>
 * <p>Each property is auto-detected by looking up a single
 * {@link TransViewTemplateConfigurer} bean in the web application context and using
 * it to obtain the configured properties.
 * You must create a {@link TransViewTemplateConfigurer} bean
 * The  * {@link TransViewTemplateConfigurer} bean will create
 * a thread safe resource pool of warmed up Nashorn engines.
 * <p>
 * <p>
 * <p>The Nashorn JavaScript engine requires Java 8+
 *
 * @see TransViewTemplateConfigurer
 */
public class TransViewTemplateView extends AbstractUrlBasedView {

    @Nullable
    private Charset charset;

    @Nullable
    private String renderFunction;

    @Nullable
    private String renderObject;

    @Nullable
    private ResourceLoader resourceLoader;

    @Nullable
    private String[] resourceLoaderPaths;

    @Nullable
    private NashornTransViewResourcePool transViewResourcePool;

    /**
     * **********************************************
     * *************** Constructors ******************
     * **********************************************
     */

    public TransViewTemplateView() {
        setContentType(null);
    }

    public TransViewTemplateView(String url) {
        super(url);
        setContentType(null);
    }

    /**
     * **********************************************
     * *********** Getters and Setters **************
     * **********************************************
     */

    public TransViewTemplateView setCharset(Charset charset) {
        this.charset = charset;
        return this;
    }

    public TransViewTemplateView setResourceLoader(@Nullable ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
        return this;
    }

    public TransViewTemplateView setResourceLoaderPath(String resourceLoaderPath) {
        this.resourceLoaderPaths = ResourceUtil.getResourceLoaderPaths(resourceLoaderPath);
        return this;
    }

    /**
     * **********************************************
     * *********** Initialization *******************
     * **********************************************
     */

    @Override
    protected void initApplicationContext(ApplicationContext context) {
        super.initApplicationContext(context);

        TransViewTemplateConfigurer config = autodetectViewConfig();

        if (this.charset == null) this.charset = config.getCharset();
        if (this.getContentType() == null) this.setContentType(config.getContentType());

        if (this.resourceLoader == null) this.resourceLoader = config.getResourceLoader();
        if (this.resourceLoaderPaths == null) this.resourceLoaderPaths = ResourceUtil.getResourceLoaderPaths(config.getResourceLoaderPath());

        this.renderObject = config.getRenderObject();
        this.renderFunction = config.getRenderFunction();
        this.transViewResourcePool = config.getNashornTransViewResourcePool();

        Assert.notNull(this.resourceLoader, "You must define a resourceLoader via TransViewTemplateView or the TransViewTemplateConfigurer");
        Assert.notNull(this.transViewResourcePool, "You must define a TransViewResourcePool via the TransViewTemplateConfigurer");
        Assert.notNull(this.renderFunction, "You must define a renderFunction via the TransViewTemplateConfigurer");
    }


    private TransViewTemplateConfigurer autodetectViewConfig() throws BeansException {
        try {
            return BeanFactoryUtils.beanOfTypeIncludingAncestors(obtainApplicationContext(), TransViewTemplateConfigurer.class, true, false);
        } catch (NoSuchBeanDefinitionException ex) {
            throw new ApplicationContextException("Expected a single TransViewTemplateConfigurer bean in the current " +
                    "Servlet web application context or the parent root context.", ex);
        }
    }

    /**
     * **********************************************
     * *********** Response *************************
     * **********************************************
     */

    @Override
    protected void prepareResponse(HttpServletRequest request, HttpServletResponse response) {
        super.prepareResponse(request, response);

        setResponseContentType(request, response);
        if (this.charset != null) {
            response.setCharacterEncoding(this.charset.name());
        }
    }

    /**
     * **********************************************
     * *********** Render ***************************
     * **********************************************
     */

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        Assert.notNull(this.transViewResourcePool, "You must define a TransViewResourcePool via the TransViewTemplateConfigurer");
        Assert.notNull(this.renderFunction, "You must define a renderFunction via the TransViewTemplateConfigurer");

        ExecutorService exec = null;

        try {
            String url = getUrl();
            Assert.state(url != null, "'url' not set");
            String template = ResourceUtil.getTemplate(this.resourceLoader, this.resourceLoaderPaths, this.charset, url);

            Function<String, String> templateLoader = path -> {
                try {
                    return ResourceUtil.getTemplate(this.resourceLoader, this.resourceLoaderPaths, this.charset, path);
                } catch (IOException ex) {
                    throw new IllegalStateException(ex);
                }
            };

            Locale locale = RequestContextUtils.getLocale(request);
            RenderingContext context = new RenderingContext(obtainApplicationContext(), locale, templateLoader, url);
            exec = Executors.newSingleThreadExecutor();

            Object html;
            if (this.renderFunction == null) {
                SimpleBindings bindings = new SimpleBindings();
                bindings.putAll(model);
                model.put("renderingContext", context);

                Callable<Object> evalTemplateBindings = () ->
                        transViewResourcePool.evalTemplateBindings(template, bindings);

                html = exec.submit(evalTemplateBindings).get();
                exec.isShutdown();
            } else if (this.renderObject != null) {
                // TODO: Check if we need to eval the renderObject separately, needs testing
                Callable<Object> evalObject = () -> transViewResourcePool.evalObject(renderObject);

                Object thiz = exec.submit(evalObject).get();

                Callable<Object> invokeMethodWithRenderObject = () ->
                        transViewResourcePool.invokeFunctionWithRenderObject(thiz, renderFunction, template, model, context);

                html = exec.submit(invokeMethodWithRenderObject).get();
                exec.isShutdown();
            } else {
                // This the method is most likely to be used by React, our case
                Callable<Object> invokeMethod = () ->
                        transViewResourcePool.invokeFunction(renderFunction, template, model, context);

                html = exec.submit(invokeMethod).get();
                exec.isShutdown();
            }

            response.getWriter().write(String.valueOf(html));
        } catch (Exception ex) {
            throw new ServletException("Failed to render script template", new StandardScriptEvalException(new ScriptException(ex)));
        } finally {
            if (exec != null && !exec.isShutdown()) exec.shutdown();
        }
    }

    /**
     * **********************************************
     * *********** Util *****************************
     * **********************************************
     */

    @Override
    public boolean checkResource(Locale locale) {
        String url = getUrl();
        Assert.state(url != null, "'url' not set");
        return (ResourceUtil.getResource(resourceLoader, resourceLoaderPaths, url) != null);
    }
}
