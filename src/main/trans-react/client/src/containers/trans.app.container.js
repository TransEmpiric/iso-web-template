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
import {Route} from 'react-router';

import AppMetaContainer from './appMeta.container';
import MainContentContainer from "./main.content.container";
import {RedirectHoc} from '../hoc/redirect.hoc';
import TransTopNavComponent from '../components/core/trans.top.nav.component';
import TransBannerComponent from '../components/core/trans.banner.component';
import TransSideNavComponent from '../components/core/trans.side.nav.component';

/* Styles */
import '../style/trans-app/trans-app-style.less';

const TransAppContainer = () => (
    <div className="trans-view">
        <AppMetaContainer/>
        <TransTopNavComponent/>
        <TransBannerComponent/>
        <TransSideNavComponent/>
        <Route component={RedirectHoc(MainContentContainer)} />
    </div>
);

export default TransAppContainer;
