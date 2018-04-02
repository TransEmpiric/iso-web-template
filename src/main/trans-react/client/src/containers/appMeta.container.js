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

/* @flow */
import React from 'react';
import Helmet from 'react-helmet';

/**
 * Renders nothing directly.
 * Updates the DOM with specified data.
 * Note: No script tags here, we want these to appear at the bottom
 * of the body element, and keep Helmet from re-inserting them at the top.
 */
const AppMetaContainer = () => (
  <Helmet
    htmlAttributes={{ lang: 'en' }}
    titleTemplate="Transempiric - %s"
    defaultTitle="Transempiric Web Template"
    meta={[
      { name: 'description', content: 'Transempiric Isomorphic Web Template' },
      { property: 'og:type', content: 'article' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'msapplication-config', content: '/static/public/icon/browserconfig.xml' }
    ]}
    link={[
        { rel: 'canonical', href: 'http://isotemplate.transempiric.com' },
        { rel: 'manifest', href: '/static/public/icon/manifest.json' },
        { rel: 'apple-touch-icon', href: '/static/public/icon/apple-icon-57x57.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/static/public/icon/apple-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/static/public/icon/apple-icon-76x76.png' },
        { rel: 'icon', type: 'image/png', href: '/static/public/icon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', href: '/static/public/icon/favicon-16x16.png' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/static/public/icon/favicon.ico' },
        { rel: 'stylesheet', href: '/static/public/css/trans-font.css' },
        { rel: 'stylesheet', href: '/static/public/css/materialdesignicons.min.css' }
    ]}
  />
);

export default AppMetaContainer;