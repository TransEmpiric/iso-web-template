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

import logger from '../../utils/logger.util';
import type {AuthState} from '../../modules/auth/auth.state';
import {doLogOut} from '../../modules/auth/auth.module';
import {doToggleSideNav} from "../../modules/app/app.module";

const source = "trans.top.nav.component.js";

type Props = {
    auth: AuthState,
    showSideNav: boolean,
    doLogOut: () => void,
    doToggleSideNav: () => void,
    history: {
        push: (path: string) => void
    }
};

class TransTopNavComponent extends React.Component<Props> {
    handleSignOut() {
        this.props.doLogOut();
        logger.info({func: "handleSignOut()", message: "SUCCESS", props: this.props}, source);
        this.props.history.push('/signIn');
    }

    toggleSideNav() {
        this.props.doToggleSideNav();
    }

    authLink() {
        if (!this.props.auth.signedIn) {
            return <Link className="trans-top-nav-sign-in" to="/signIn">Sign In</Link>;
        }

        return (
                <span className="trans-top-nav-sign-out" onClick={() => this.handleSignOut()}>Sign Out</span>
        );
    }

    render() {
        return (
            <div className="trans-top-nav-container">
                <div className="trans-top-nav">
                    <div className="trans-top-nav-left">
                        <div className="trans-top-nav-menu" >
                            <span className="trans-top-nav-menu-icon trans-ripple mdi mdi-menu" onClick={() => this.toggleSideNav()}/>
                        </div>
                    </div>
                    <div className="trans-top-nav-middle">
                        <div className="trans-top-nav-title">ISO Template</div>
                    </div>
                    <div className="trans-top-nav-right">
                        {this.authLink()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        auth: state.auth,
        showSideNav: state.app.showSideNav
    }
);
const mapDispatchToProps = {doLogOut, doToggleSideNav};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(TransTopNavComponent)
);
