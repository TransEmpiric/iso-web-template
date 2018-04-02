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

import type {BeerType} from '../../modules/beer/beer.type';
import BeerTypeComponent from './beer.type.component';
import {refreshBeers} from '../../modules/beer/beers.module';
import {doUpdateBanner} from "../../modules/app/app.module";

/* Styles */
import './beer-list-component.less';

type Props = {
    status: string,
    beers: BeerType[],
    refreshBeers: () => void,
    doUpdateBanner: () => void,
};

class BeerListComponent extends React.Component<Props> {
    componentWillMount() {
        this.props.doUpdateBanner('Beer List', 'beer');
    }

    componentDidMount() {
        if (this.props.status === 'stale') {
            this.props.refreshBeers();
        }
    }

    handleRefreshBeers() {
        this.props.refreshBeers();
    }

    render() {
        //this.props.doUpdateBannerIcon('beer');
        return (
            <div className="comments">
                <h1>Beers</h1>
                <div>
                    <Link to="/beer/add" className="btn btn-primary">Add Beer</Link>
                    {' '}
                    <button className="btn btn-default" onClick={() => this.handleRefreshBeers()}>Refresh</button>
                </div>
                { this.props.beers.length === 0
                    ? <p>No Beers yet! You could add one&hellip;?</p>
                    : this.props.beers.map(each => <BeerTypeComponent name={each.name} comment={each.comment} key={each.id} />) }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        status: state.beer.status,
        beers: state.beer.data,
    };
}

export default connect(mapStateToProps, { refreshBeers, doUpdateBanner })(BeerListComponent);