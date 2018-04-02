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
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import logger from '../../utils/logger.util';
import type {AuthorityType} from '../../modules/auth/auth.authority.type';
import SignInFormComponent from '../form/signIn.form.component';
import {authenticated} from '../../modules/auth/auth.module';
import {doLogin} from '../../modules/auth/auth.module';

const source = "signIn.component.js";

type Props = {
    authenticated: (authData: { authorities: AuthorityType[] }) => void,
    location: {
        state?: {
            nextPathname?: string
        }
    },
    history: {
        push: (path: string) => void
    }
};

type State = {
    authFailed: boolean
};

class SignInComponent extends React.Component<Props, State> {
    state = {
        authFailed: false
    };

    login(username : string, password : string) : void {
        logger.info({func: "login()", props: this.props},  source);

        this.props.doLogin(username, password);

        const { location } = this.props;
        const nextPathname = location.state && location.state.nextPathname ? location.state.nextPathname : '/';

        this.props.history.push(nextPathname);
    }

    submitForm(formValues) {
        logger.info({func: "submitForm()", formValues: formValues},  source);
        const username = formValues.username ? formValues.username.trim() : '';
        const password = formValues.password ? formValues.password.trim() : '';

        if (username.length === 0) {
            return;
        }

        this.login(username, password);
    }

    authFailedMessage() {
        if (!this.state.authFailed) {
            return null;
        }

        return (
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-sm-offset-3 alert alert-danger" role="alert">
                    Authentication failed!
                </div>
            </div>);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3">
                        <h1>Sign In</h1>
                    </div>
                </div>
                {this.authFailedMessage()}
                <SignInFormComponent
                    testVal={"hello"}
                    onSubmit={(formValues) => this.submitForm(formValues)}
                />
            </div>
        );
    }
}

export default withRouter(
    connect(null, {authenticated, doLogin})(SignInComponent)
);
