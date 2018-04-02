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

import logger from "../../utils/logger.util";
import envUtil from '../../utils/env.util';
import transSelectorUtil from "../../utils/trans.selector.util";
import {closeSideNav} from "../../modules/app/app.module";

const source = "trans.side.nav.component.js";

type Props = {
    showSideNav: boolean,
    closeSideNav: () => void
};

class TransSideNavComponent extends React.Component<Props> {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnClickOutside = this.handleOnClickOutside.bind(this);
    }

    componentDidMount() {
        if (envUtil.isBSR()) {
            logger.info({func: "componentWillMount()", message: "Adding mousedown event listener"}, source);
            document.addEventListener('mousedown', this.handleOnClick, false)
        }
    }

    componentWillUnmount() {
        // Check render (server or client)
        if (envUtil.isBSR()) {
            logger.info({func: "componentWillUnmount()", message: "Removing mousedown event listener"}, source);
            document.removeEventListener('mousedown', this.handleOnClick, false);
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleOnClick(event) {
        if (envUtil.isBSR()) {
            if ((this.wrapperRef && this.wrapperRef.contains(event.target))
                || transSelectorUtil.hasClass("trans-top-nav-menu-icon", event.target)) return;
            this.handleOnClickOutside();
        } else {
            this.props.closeSideNav();
        }
    }

    handleOnClickOutside() {
        if (this.props.showSideNav) this.props.closeSideNav();
    }

    render() {
        logger.info({func: "render()", showSideNav: this.props.showSideNav}, source);
        return (
            <div className={"trans-side-nav" + (this.props.showSideNav ? " trans-side-nav-show" : "")} ref={this.setWrapperRef}>
                <div className="trans-side-nav-content">
                    <div className="trans-side-nav-menu">
                        <div className="trans-side-nav-menu-top">
                            <Link className="trans-side-nav-menu-link" to="/">Home</Link>
                            <Link className="trans-side-nav-menu-link" to="/beer/list">Beer List</Link>
                            <Link className="trans-side-nav-menu-link" to="/beer/add">Add Beer</Link>
                        </div>
                        <div className="trans-side-nav-menu-bottom">
                            <div className="trans-side-nav-bottom-content">
                                <div className="trans-side-nav-logo-container">
                                    <img style={{border: "0"}} className="responsive-image" alt="" src="/static/public/image/trans_logo_36x36.png"/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        showSideNav: state.app.showSideNav
    };
}

export default withRouter(connect(mapStateToProps, {closeSideNav})(TransSideNavComponent));