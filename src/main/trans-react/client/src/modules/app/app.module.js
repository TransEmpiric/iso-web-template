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
import logger from '../../utils/logger.util';
import type {AppState} from './app.state';
import * as appConst from "./app.const";
import type {Thunk} from "../index";

const source = "app.module.js";

type AppStateBusyAction = {
    type: appConst.APP_STATE_BUSY
};

type AppStateReadyAction = {
    type: appConst.APP_STATE_READY
};

type AppStateUpdateBanner = {
    type: appConst.APP_STATE_UPDATE_BANNER,
    bannerTitle: string,
    bannerIcon: string
};

type AppStateToggleSideNav = {
    type: appConst.APP_STATE_TOGGLE_SIDE_NAV,
    showSideNav: boolean
};

type Action = AppStateReadyAction
    | AppStateBusyAction
    | AppStateUpdateBanner
    | AppStateToggleSideNav;

const defaultState = {
    env: "dev",
    inst: "dev",
    busy: false,
    bannerTitle: null,
    bannerIcon: null,
    showSideNav: false
};

export default function reducer(appState: AppState = defaultState, action: Action): AppState {
    logger.info({func: "reducer", message:"SWITCH_START", appState : appState, action: action}, source);
    switch (action.type) {
        case appConst.APP_STATE_READY:
            return {
                env: appState.env,
                inst: appState.inst,
                busy: false,
                bannerTitle: appState.bannerTitle,
                bannerIcon: appState.bannerIcon,
                showSideNav: appState.showSideNav
            };
        case appConst.APP_STATE_BUSY:
            return {
                env: appState.env,
                inst: appState.inst,
                busy: true,
                bannerTitle: appState.bannerTitle,
                bannerIcon: appState.bannerIcon,
                showSideNav: appState.showSideNav
            };
        case appConst.APP_STATE_UPDATE_BANNER:
            return {
                env: appState.env,
                inst: appState.inst,
                busy: appState.busy,
                bannerTitle: action.bannerTitle ? action.bannerTitle : appState.bannerTitle,
                bannerIcon: action.bannerIcon ? action.bannerIcon : appState.bannerIcon,
                showSideNav: appState.showSideNav
            };
        case appConst.APP_STATE_TOGGLE_SIDE_NAV:
            return {
                env: appState.env,
                inst: appState.inst,
                busy: appState.busy,
                bannerTitle: appState.bannerTitle,
                bannerIcon: appState.bannerIcon,
                showSideNav: action.showSideNav
            };
        default:
            return appState;
    }
}

export function appBusy() : AppStateBusyAction {
    logger.info({func: "appBusy()"}, source);
    return {
        type: appConst.APP_STATE_BUSY
    };
}

export function appReady() : AppStateReadyAction {
    logger.info({func: "appReady()"}, source);
    return {
        type: appConst.APP_STATE_READY
    };
}

export function updateBanner(title: string, icon: string) : AppStateUpdateBanner {
    logger.info({func: "updateBanner()"}, source);
    return {
        type: appConst.APP_STATE_UPDATE_BANNER,
        bannerTitle: title,
        bannerIcon: icon
    };
}

export function doUpdateBanner(title: string, icon: string): Thunk<AppStateUpdateBanner> {
    logger.info({func: "doUpdateBanner()"}, source);
    return (dispatch, getState) => {
        let state = getState();
        if (state.app.bannerTitle !== title || state.app.bannerIcon !== icon) dispatch(updateBanner(title, icon));
    };
}

export function toggleSideNav(showSideNav: boolean) : AppStateToggleSideNav {
    logger.info({func: "toggleSideNav()"}, source);
    console.log("toggleSideNav showSideNav:" + showSideNav);
    return {
        type: appConst.APP_STATE_TOGGLE_SIDE_NAV,
        showSideNav: showSideNav,
    };
}

export function doToggleSideNav(): Thunk<AppStateToggleSideNav> {
    logger.info({func: "doToggleSideNav()"}, source);
    console.log({func: "doToggleSideNav()"}, source);
    return (dispatch, getState) => {
        let state = getState();
        console.log("toggleSideNav state.app.showSideNav: " + state.app.showSideNav);
        dispatch(toggleSideNav(!state.app.showSideNav));
    };
}

export function openSideNav(): Thunk<AppStateToggleSideNav> {
    logger.info({func: "openSideNav()"}, source);
    console.log({func: "openSideNav()"}, source);
    return (dispatch, getState) => {
        let state = getState();
        console.log("doCloseSideNav state.app.showSideNav: " + state.app.showSideNav);
        if (!state.app.showSideNav) dispatch(toggleSideNav(true));
    };
}

export function closeSideNav(): Thunk<AppStateToggleSideNav> {
    logger.info({func: "doCloseSideNav()"}, source);
    console.log({func: "doCloseSideNav()"}, source);
    return (dispatch, getState) => {
        let state = getState();
        console.log("doCloseSideNav state.app.showSideNav: " + state.app.showSideNav);
        if (state.app.showSideNav) dispatch(toggleSideNav(false));
    };
}