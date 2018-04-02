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

package com.transempiric.transView.utils;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;

public class ResourceUtil {
    public static Resource getResource(ResourceLoader resourceLoader, String[] resourceLoaderPaths, String path) {
        if (resourceLoaderPaths != null) {
            for (String resourceLoaderPath : resourceLoaderPaths) {
                Resource resource = resourceLoader.getResource(resourceLoaderPath + path);
                if (resource.exists()) {
                    return resource;
                }
            }
        }
        return null;
    }

    public static Reader read(ResourceLoader resourceLoader, String[] resourceLoaderPaths, Charset charset, String path) throws IOException {
        Resource resource = getResource(resourceLoader, resourceLoaderPaths, path);
        if (resource == null) {
            throw new IllegalStateException("TransView resource [" + path + "] not found.");
        }
        return ((charset != null) ?
                new InputStreamReader(resource.getInputStream(), charset) :
                new InputStreamReader(resource.getInputStream()));
    }

    public static String getTemplate(ResourceLoader resourceLoader, String[] resourceLoaderPaths, Charset charset, String path) throws IOException {
        Resource resource = getResource(resourceLoader, resourceLoaderPaths, path);
        if (resource == null) {
            throw new IllegalStateException("Template resource [" + path + "] not found");
        }
        Reader reader = read(resourceLoader, resourceLoaderPaths, charset, path);
        return FileCopyUtils.copyToString(reader);
    }

    public static String[] getResourceLoaderPaths(String resourceLoaderPath) {
        String[] paths = StringUtils.commaDelimitedListToStringArray(resourceLoaderPath);
        String[] resourceLoaderPaths = new String[paths.length + 1];
        resourceLoaderPaths[0] = "";
        for (int i = 0; i < paths.length; i++) {
            String path = paths[i];
            if (!path.endsWith("/") && !path.endsWith(":")) {
                path = path + "/";
            }
            resourceLoaderPaths[i + 1] = path;
        }
        return resourceLoaderPaths;
    }
}