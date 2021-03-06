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
import { FormProps, Field, reduxForm } from 'redux-form'

import InputTextComponent from "../input/input.text.component";

type Props = {
    handleSubmit: () => void
} & FormProps

class SignInFormComponent extends React.Component<Props> {
    props: Props;

    render() {
        const { handleSubmit, pristine, onSubmit, submitting } = this.props;
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Field
                    name="username"
                    component={InputTextComponent}
                    type="text"
                    label="Username"
                    placeholder="Username"
                    icon="account-box"
                />
                <Field
                    name="password"
                    component={InputTextComponent}
                    type="password"
                    label="Password"
                    placeholder="Password"
                    icon="lock"
                />
                <button  disabled={pristine || submitting} type="submit" className="trans-btn trans-btn-green">Sign In</button>
            </form>
        );
    }
}

const formConfiguration = {
    form: 'sign-in-form'
};

export default reduxForm(formConfiguration)(SignInFormComponent);