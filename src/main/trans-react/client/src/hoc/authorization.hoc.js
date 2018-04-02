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
import * as React from 'react';
import {connect} from 'react-redux';
import { Redirect } from 'react-router';

import logger from '../utils/logger.util';
import {loadAuthState} from "../modules/auth/auth.module";
import {isAuthorized} from "../modules/auth/auth.util";

const source = "authorization.hoc.js";

export const AuthorizationHoc = (allowedRoles) =>
    (WrappedComponent) => {
        class WithAuthorizationHoc extends React.Component {
            componentDidMount = () => {
                logger.info({func: "componentDidMount()", props: this.props, allowedRoles: allowedRoles}, source);

                if (!this.props.signedIn && this.props.authLoadState === 'AUTH_LOAD_STATE_NOT_STARTED'){
                    logger.info({func: "componentDidMount()", message: "!signedIn && authLoadState is AUTH_LOAD_STATE_NOT_STARTED"}, source);
                    this.props.loadAuthState();
                }
            };

            render() {
                logger.info({func: "render()", props: this.props, allowedRoles: allowedRoles}, source);

                if (this.props.signedIn  && isAuthorized(allowedRoles, this.props.authorities)) {
                    logger.info({func: "render()", message: "signedIn === true  && isAuthorized"}, source);
                    return <WrappedComponent {...this.props} />;
                }

                logger.info({func: "componentDidMount()", authLoadState: this.props.authLoadState}, source);
                switch (this.props.authLoadState) {
                    case 'AUTH_LOAD_STATE_NOT_STARTED':
                        return <h1>LOADING... AUTH_LOAD_STATE_NOT_STARTED.</h1>;
                    case 'AUTH_LOAD_STATE_STARTED':
                        return <h1>LOADING... AUTH_LOAD_STATE_STARTED.</h1>;
                    case 'AUTH_LOAD_STATE_COMPLETED':
                        if(this.props.redirect) {
                            logger.info({func: "render()", message: "AUTH_LOAD_STATE_COMPLETED, found this.props.redirect"}, source);
                            return (<Redirect
                                to={{
                                    pathname: this.props.redirect,
                                    // eslint-disable-next-line react/prop-types
                                    state: { from: this.props.location }
                                }}
                            />)
                        }

                        if (isAuthorized(allowedRoles, this.props.authorities)) {
                            return <WrappedComponent {...this.props} />
                        } else {
                            return <h1>No page for you!</h1>
                        }
                    default:
                        return <h1>No page for you!  DEFAULT.</h1>;
                }
            };

        }

        function mapStateToProps(state) {
            logger.info({func: "mapStateToProps()", state: state}, source);
            return {
                signedIn: state.auth.signedIn,
                authLoadState: state.auth.authLoadState,
                authorities: state.auth.authorities,
                redirect: state.auth.redirect
            };
        }

        return connect(mapStateToProps, { loadAuthState })(WithAuthorizationHoc);
    };

export const AUTHORIZE_USER = AuthorizationHoc(['ROLE_USER']);
export const AUTHORIZE_ADMIN = AuthorizationHoc(['ROLE_ADMIN']);