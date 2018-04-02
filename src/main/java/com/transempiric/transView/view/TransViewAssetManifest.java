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

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class TransViewAssetManifest {
    private String jsonManifestPath;
    private List<Script> scripts;

    public enum LookUpType {JSON_MANIFEST, RESOURCE_PATH}

    public TransViewAssetManifest() {
        this.jsonManifestPath = null;
        scripts = new ArrayList<>();
    }

    public TransViewAssetManifest(String jsonManifestPath) {
        this.jsonManifestPath = jsonManifestPath;
        scripts = new ArrayList<>();
    }

    public String getJsonManifestPath() {
        return jsonManifestPath;
    }

    public List<Script> getScripts() {
        sortScripts();
        return scripts;
    }

    public TransViewAssetManifest addScriptKey(String key, int precedence) {
        Assert.hasLength(key, "Script key can not be null or empty.");
        scripts.add(new Script(key, null, precedence));
        return this;
    }

    public TransViewAssetManifest addScriptPath(String path, int precedence) {
        Assert.hasLength(path, "Script path can not be null or empty.");
        scripts.add(new Script(null, path, precedence));
        return this;
    }

    private void sortScripts() {
        scripts.sort(Comparator.comparing(Script::getPrecedence));
    }

    public String prettyToString() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n\t\t\t{") ;
            sb.append("\n\t\t\t\tjsonManifestPath: ")
                    .append(jsonManifestPath)
                    .append(",") ;

            if (scripts.size() > 0) {
                sb.append("\n\t\t\t\tscripts: [");
                for(int i=0; i < scripts.size(); i++) {
                    sb.append(scripts.get(i).prettyToString());
                    if(i != scripts.size() -1){
                        sb.append(",");
                    }
                }
                sb.append("\n\t\t\t\t]") ;
            } else {
                sb.append("\n\t\t\t\tscripts: [ ]");
            }
        sb.append("\n\t\t\t}") ;
        return sb.toString();
    }

    public class Script {

        private String jsonManifestKey;
        private String resourcePath;
        private int precedence;
        private TransViewAssetManifest.LookUpType lookUpType;

        Script(String jsonManifestKey, String resourcePath, int precedence) {
            Assert.isTrue(StringUtils.hasLength(jsonManifestKey) || StringUtils.hasLength(resourcePath), "Script jsonManifestKey and resourcePath can not both be null or empty");
            Assert.isTrue(!StringUtils.hasLength(jsonManifestKey) || !StringUtils.hasLength(resourcePath), "Script jsonManifestKey and resourcePath are both defined, please just one or the other.");

            this.jsonManifestKey = jsonManifestKey;
            this.resourcePath = resourcePath;
            lookUpType = StringUtils.hasLength(jsonManifestKey) ? TransViewAssetManifest.LookUpType.JSON_MANIFEST : TransViewAssetManifest.LookUpType.RESOURCE_PATH;
            this.precedence = precedence;
        }

        public String getJsonManifestKey() {
            return jsonManifestKey;
        }

        public String getResourcePath() {
            return resourcePath;
        }

        int getPrecedence() {
            return precedence;
        }

        public LookUpType getLookUpType() {
            return lookUpType;
        }

        String prettyToString() {
            return ""
                    + "\n\t\t\t\t\t{"
                        + "\n\t\t\t\t\t\tjsonManifestKey: " +  jsonManifestKey + ", "
                        + "\n\t\t\t\t\t\tresourcePath: " +  resourcePath + ", "
                        + "\n\t\t\t\t\t\tprecedence: " +  precedence + ", "
                        + "\n\t\t\t\t\t\tlookUpType: " +  lookUpType.name()
                    + "\n\t\t\t\t\t}";
        }
    }
}
