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
import {Redirect} from 'react-router';

import logger from '../utils/logger.util';
import {ErrorListComponent} from "../components/index";
import {doDismissAllError, doDismissError, unlock} from "../modules/error/error.module";

const source = "redirect.hoc.js";

export const RedirectHoc = (WrappedComponent) => {
    class WithRedirectHoc extends React.Component {
        previousLocation = this.props.location;

        componentDidMount = () => {
            const { location } = this.props;

            logger.info({func: "componentDidMount()", props: this.props, location: location, previousLocation: this.previousLocation}, source);

            if (this.props.locked) this.props.unlock();
        };

       shouldComponentUpdate = () => {
           const { location } = this.props;

           logger.info({func: "shouldComponentUpdate()", props: this.props, location: location, previousLocation: this.previousLocation}, source);

            if (this.props.locked) return false;

            return true;
        };

        componentWillUpdate(nextProps) {
            const { location } = this.props;

            logger.info(
                {func: "componentWillUpdate()",
                    props: this.props,
                    location: location,
                    previousLocation:
                    this.previousLocation,
                    nextHistoryActon: nextProps.history.action
                }
                , source);
        }

        render() {
            const { location } = this.props.location;

            const isLocationChange = (this.props.redirect &&  (this.props.redirect !== this.previousLocation.pathname));

            logger.info(
                {func: "render()",
                    props: this.props,
                    location: location,
                    previousLocation:
                    this.previousLocation,
                    isLocationChange: isLocationChange
                }
                , source);

            if (!this.props.locked || (this.props.redirect &&  this.props.redirect === this.previousLocation.pathname)) {
                logger.info({func: "render()", message: "DO_REGULAR_RENDER"}, source);
                return <WrappedComponent {...this.props} />;
            }

            if (this.props.redirect &&  (this.props.redirect !== this.previousLocation.pathname) && this.props.locked) {
                logger.info({func: "render()", message: "DO_REDIRECT_RENDER"}, source);
                return (<Redirect
                    to={{
                        pathname: this.props.redirect,
                        // eslint-disable-next-line react/prop-types
                        state: {from: this.props.location}
                    }}
                />)
            }
            logger.info({func: "render()", message: "DO_ERROR_RENDER"}, source);
            return <ErrorListComponent {...this.props} />
        };

    }

    function mapStateToProps(state) {
        return {
            locked: state.error.locked,
            hasErrors: state.error.hasErrors,
            errors: state.error.errors,
            logout: state.error.logout,
            redirect: state.error.redirect
        };
    }

    return connect(mapStateToProps, {unlock, doDismissError, doDismissAllError})(WithRedirectHoc);
};