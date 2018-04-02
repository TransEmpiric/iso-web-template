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
import {saveBeer} from '../../modules/beer/beers.module';

const source = "beer.add.component.js";

type Props = {
    dispatch: Function,
    history: {
        push: (path: string) => void
    }
};

class BeerAddComponent extends React.Component<Props> {
    nameInput : ?HTMLInputElement;
    commentInput: ?HTMLInputElement;

    addBeer(name : string, comment : string) : void {
        this.props.dispatch(saveBeer(name, comment))
            .then(
                success => {
                    logger.error({func: "addBeer()", message: "SUCCESS, redirecting to home"}, source);
                    this.props.history.push('/beer/list');
                },
                error => {
                    logger.error({func: "addBeer()", message: "Error, doing nothing",  error: error}, source);
                }
            );
    }

    onSubmit(e) {
        e.preventDefault();

        const name = this.nameInput;
        const comment = this.commentInput;

        if (name && comment) {
            this.addBeer(name.value.trim(), comment.value.trim());
            name.value = '';
            comment.value = '';
        }
    }

    render() {
        return (
            <form onSubmit={e => this.onSubmit(e)}>
                <p>Add A Brew</p>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" className="form-control" type="text" size={50} ref={el => { this.nameInput = el; }} />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Comment</label>
                    <input id="comment" className="form-control" type="text" size={50} ref={el => { this.commentInput = el; }} />
                </div>
                <Link to="/" className="btn btn-primary">Back</Link>
                {' '}
                <button className="btn btn-success" type="submit">Submit</button>
            </form>);
    }
}

function mapStateToProps(state) {
    return {
        publicKey: state.beer.publicKey
    };
}

export default withRouter(connect(mapStateToProps)(BeerAddComponent));