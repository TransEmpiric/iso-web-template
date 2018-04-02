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
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import logger from '../../utils/logger.util';
import type {ErrorType} from '../../modules/error/error.type';
import ErrorTypeComponent from "./error.type.component";
import {dismissError} from '../../modules/error/error.module';

/* Styles */
import './error-list-component.less';

const source = "error.list.component.js";

type Props = {
    hasErrors: boolean,
    errors: ErrorType[],
    dismissError: () => void
};

class ErrorsListComponent extends React.Component<Props> {
    handleDismissError() {
        this.props.dismissError();
    }

    render() {
        logger.info({func: "render()", props: this.props}, source);
        return (
            <div className="errors-container">
                <h1>Errors</h1>
                <div>
                    <Link to="/" className="btn btn-primary">Home</Link>
                </div>
                { this.props.hasErrors
                    ? this.props.errors.map(each => <ErrorTypeComponent id={each.id} name={each.name} displayMessage={each.displayMessage}  code={each.code} />)
                    : <p>No Errors yet.</p> }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        hasErrors: state.error.hasErrors,
        errors: state.error.errors
    };
}

export default connect(mapStateToProps, { dismissError })(ErrorsListComponent);
