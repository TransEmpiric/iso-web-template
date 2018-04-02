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

import envUtil from './env.util';

const transSelectorUtil = {
    closestByClass(el, clazz) {
        if (!envUtil.isBSR()) return null;
        
        /* Traverse the DOM up with a while loop */
        while (el.className !== clazz) {
            /* Increment the loop to the parent node */
            el = el.parentNode;
            if (!el) {
                return null;
            }
        }

        /* Return the matched element */
        return el;
    },

    removeElementsByClass(clazz, containerId = null) {
        if (!envUtil.isBSR()) return;
        
        let elements = null;

        if (containerId !== null) {
            let container = document.getElementById(containerId);
            elements = container.getElementsByClassName(clazz);
        } else {
            elements = document.getElementsByClassName(clazz);
        }

        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    },

    hasClass(cls, ele) {
        if(ele) return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    addClass(cls, ele) {
        if(ele) if (!this.hasClass(cls, ele)) ele.className += " " + cls;
    },

    removeClass(cls, ele) {
        if(ele) {
            if (this.hasClass(cls, ele)) {
                let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                ele.className = ele.className.replace(reg, ' ');
            }
        }
    },

    removeAllClass(cls, parentEle) {
        let elements = parentEle.getElementsByClassName(cls);

        for (let i = 0; i < elements.length; i++) {
            this.removeClass(cls, elements[i]);
        }
    },

    isFunction(functionToCheck) {
        let getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
};

export default transSelectorUtil;