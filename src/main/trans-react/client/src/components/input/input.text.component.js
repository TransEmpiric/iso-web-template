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

import React from 'react';

import transSelectorUtil from "../../utils/trans.selector.util";

export const InputTextComponent = ({ label, type, input, icon }) => {
    function handleInputTextComponentOnFocus(event) {
        console.log(event);
        let parentElement = event.target.parentNode;
        let iconElements = parentElement.getElementsByClassName('trans-input-icon');

        for (let i = iconElements.length; i--; ) {
            transSelectorUtil.addClass('highlight', iconElements[i]);
        }
    }

    function handleInputTextComponentOnBlur(event) {
        console.log(event);
        let parentElement = event.target.parentNode;
        let iconElements = parentElement.getElementsByClassName('trans-input-icon');

        for (let i = iconElements.length; i--; ) {
            transSelectorUtil.removeClass('highlight', iconElements[i]);
        }
    }

    return (
        <div data-max-width="xl" className="trans-input-container">
            <div className="trans-input-with-icon">
                <sapn className={"mdi mdi-" + icon + " trans-input-icon "}/>
                <input
                    {...input}
                    placeholder={label}
                    type={type}
                    className="trans-input-field"
                    onFocus={ handleInputTextComponentOnFocus }
                    onBlur={ handleInputTextComponentOnBlur }
                    ref={el => { this.nameInput = el; }}
                />
            </div>
        </div>
    );
};

export default InputTextComponent;