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
import {Link, withRouter} from 'react-router-dom';

import logger from '../../utils/logger.util';
import {saveBeer} from '../../modules/beer/beers.module';
import BeerAddFormComponent from '../form/beer.add.form.component';

const source = "beer.add.component.js";

type Props = {
    dispatch: Function,
    history: {
        push: (path: string) => void
    }
}

class BeerAddComponent extends React.Component<Props> {
    addBeer(name : string, comment : string) : void {
        console.log("addBeer......");
        this.props.dispatch(saveBeer(name, comment))
            .then(
                () => {
                    logger.error({func: "addBeer()", message: "SUCCESS, redirecting to home"}, source);
                    this.props.history.push('/beer/list');
                },
                error => {
                    logger.error({func: "addBeer()", message: "Error, doing nothing",  error: error}, source);
                }
            );
    }

    submitForm(formValues) {
        console.log("submit addBeerForm......");

        const name = formValues.name ? formValues.name : '';
        const comment = formValues.comment ? formValues.comment : '';

        if (name.length === 0) {
            return;
        }

        this.addBeer(name, comment);
    }

    render() {
        return (
            <div className="beer-list-container">
                <div className="trans-title-lg">Add Some More Beer</div>
                <div className="beer-add-sub-header">
                    <Link data-width='sm' to="/beer/list" className="trans-hyp-link beer-list-link">Beer List</Link>
                </div>
                <BeerAddFormComponent
                    testVal={"hello"}
                    onSubmit={(formValues) => this.submitForm(formValues)}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { };
}

export default withRouter(connect(mapStateToProps)(BeerAddComponent));