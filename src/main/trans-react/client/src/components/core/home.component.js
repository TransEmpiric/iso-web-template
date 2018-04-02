
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
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {doUpdateBanner} from "../../modules/app/app.module";
import type {BeerType} from "../../modules/beer/beer.type";
import {authenticated, doLogin} from "../../modules/auth/auth.module";

type Props = {
    status: string,
    beers: BeerType[],
    refreshBeers: () => void,
    doUpdateBanner: () => void,
};

class HomeComponent extends React.Component<Props> {
    componentWillMount() {
        this.props.doUpdateBanner('Home', 'home');
    }

    render() {
        return (
            <div className="home-container">
                <div className="home-left-container">
                    <h3 className="home-header-left">Welcome to The ISO World</h3>
                    <blockquote>
                        <p className="trans-quote">
                            My dear, here we must run as fast as we can, just to stay in place. And if you wish to go anywhere you must run twice as fast as that.
                        </p>
                        <footer className="trans-quote-footer">— Lewis Carroll</footer>
                    </blockquote>
                </div>
                <div className="home-right-container">
                    <h3 className="home-header-left">i·so·mor·phism</h3>
                    <div className="home-call-out-container">
                        <ul className="home-call-out-list">
                            <li><span className="green-call-out">NEW!</span><span className="bold-call-out">Thread Safe Dynamically Allocated Nashorn Engine Pool.</span></li>
                            <li><span>Spring Boot</span></li>
                            <li><span>Spring Security</span></li>
                            <li><span>Stateless JWT Authentication</span></li>
                            <li><span>React</span></li>
                            <li><span>Redux</span></li>
                            <li><span>Flow Typed JavaScript</span></li>
                            <li><span>Webpack Dev Server</span></li>
                            <li><span>Less Components</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(
    connect(null, {doUpdateBanner})(HomeComponent)
);