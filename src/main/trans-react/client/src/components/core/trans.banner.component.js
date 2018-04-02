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
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

type Props = {
    bannerTitle: string,
    bannerIcon: string
};

class TransBannerComponent extends React.Component<Props> {
    bannerTitle() {
        return this.props.bannerTitle
            ? <span className="trans-banner-title">{this.props.bannerTitle}</span>
            : <span className="trans-banner-title">ISO Template</span>
    }

    bannerIcon() {
        return this.props.bannerIcon
            ? <span className={"mdi mdi-" + this.props.bannerIcon + " trans-banner-icon"}></span>
            : <span className="mdi mdi-desktop-classic trans-banner-icon"></span>;
    }

    render() {
        return (
            <div className="trans-banner-container">
                <div className="trans-banner">
                    {this.bannerIcon()}
                    {this.bannerTitle()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        bannerTitle: state.app.bannerTitle,
        bannerIcon: state.app.bannerIcon
    };
}

export default withRouter(
    connect(mapStateToProps)(TransBannerComponent)
);
