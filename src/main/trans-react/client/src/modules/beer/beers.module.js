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

// @flow
import axios from 'axios';
import type {Thunk} from '../';

import logger from '../../utils/logger.util';
import type {BeerType} from './beer.type';
import type {BeerState} from './beer.state';

const source = "beers.module.js";

type AddBeerAction = {
    type: 'ADD_BEER',
    payload: BeerType
};

type BeersRefreshedAction = {
    type: 'BEERS_REFRESHED',
    payload: BeerType[]
};

type Action = AddBeerAction | BeersRefreshedAction;

const defaultBeerState: BeerState = {
    status: 'stale',
    data: [],
};

export default function reducer(beerState: BeerState = defaultBeerState, action: Action): BeerState {
    logger.info({func:"reducer", message:"SWITCH_START", beerState: beerState, action: action}, source);
    switch (action.type) {
        case 'ADD_BEER':
            return {
                status: 'stale',
                data: [...beerState.data, action.payload]
            };

        case 'BEERS_REFRESHED':
            return {
                status: 'loaded',
                data: action.payload,
            };
        default:
            return beerState;
    }
}

export function addBeer(beerType: BeerType): AddBeerAction {
    return {
        type: 'ADD_BEER',
        payload: beerType
    };
}

export const saveBeer = (name: string, comment: string) => (dispatch) =>
    new Promise(function (resolve, reject) {
        axios.post('/api/rest/v1/beer', {name: name, comment: comment}).then(data => {
            logger.info({func: "saveBeer()", message: "SUCCESS, dispatching addBeer()"},  source);
            dispatch(addBeer(data));
            logger.info({func: "saveBeer()", message: "SUCCESS, resolving Promise"},  source);
            resolve("Add beer Success");
        }).catch(error => {
            logger.error({func: "saveBeer()", message: "ERROR, rejecting Promise", error: error},  source);
            reject(error);
        })
    });

export function beersRefreshed(beers: BeerType[]): BeersRefreshedAction {
    return {
        type: 'BEERS_REFRESHED',
        payload: beers
    };
}

export function refreshBeers(): Thunk<BeersRefreshedAction> {
    return dispatch => {
        axios.get('/api/rest/v1/beer')
            .then(
                (success: { data: BeerType[] }) => dispatch(beersRefreshed(success.data)),
                error => logger.error({func: "refreshBeers()", message: "ERROR, doing nothing", error: error},  source)
            );
    };
}
