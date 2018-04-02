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

/*
 =============================================================
 ====== *************** TransLoggerUtil *************** ======
 ====== ************* A node logger util ************** ======
 =============================================================
*/

'use strict';

const chalk = require('chalk');

/* Set debug level if not found */
process.env.DEBUG_LEVEL = process.env.DEBUG_LEVEL ? process.env.DEBUG_LEVEL : 'INFO';

/*
*****************************************
********** Format Constants *************
*****************************************
*/

/* 
 * A spacial formatter is used for
 * messages that start with the _call_out_trigger
*/
const _call_out_trigger = '!###';
const _call_out_regex = new RegExp(_call_out_trigger, 'g');
const _call_out_padder_char = '*';
const _call_out_padder_len = 60;
const _indentation_4 = Array(5).join(' ');
const _line_max_len = 76;
const _padder_left = 1;
const _padder_right = 2;
const _padder_both = 3;
const _src_default = 'app';
const _src_max_len = 64;
const _src_pad_left = '> ';

/*
*****************************************
**** Chalk Theme Types ******************
*****************************************
*/

/* Chalk Theme Keys */
const CLIENT_TH = 'CLIENT';
const CLIENT_BG_TH = 'CLIENT_BG';
const CUSTOM_TH = 'CUSTOM';
const DEFAULT_TH = 'DEFAULT';
const DEFAULT_BG_TH = 'DEFAULT_BG';
const SSR_TH = 'SSR';
const SSR_BG_TH = 'SSR_BG';

/* Chalk Themes WITHOUT background color */
const debugTheme = {ssr: chalk.magentaBright, default: chalk.magentaBright};
const infoTheme = {ssr: chalk.cyanBright, default: chalk.cyanBright};
const warnTheme = {ssr: chalk.yellowBright, default: chalk.yellowBright};
const errorTheme = {ssr: chalk.redBright, default: chalk.redBright};

/* Chalk Themes WITH background color */
const debugTheme_bg = {ssr: chalk.magentaBright.bgHex('#00156d'), default: chalk.magentaBright.bgBlackBright};
const infoTheme_bg = {ssr: chalk.cyanBright.bgHex('#00156d'), default: chalk.cyanBright.bgBlackBright};
const warnTheme_bg = {ssr: chalk.yellowBright.bgHex('#00156d'), default: chalk.yellowBright.bgBlackBright};
const errorTheme_bg = {ssr: chalk.redBright.bgHex('#00156d'), default: chalk.redBright.bgBlackBright};

/*
*****************************************
**** Constructor ************************
*****************************************
*/

function TransLoggerUtil(src, themeType, customTheme) {
    this.src = formatSrc(src);
    this.themeType = typeof themeType !== 'undefined' ? themeType : DEFAULT_TH;

    /* A custom theme can be passed in via the 3rd argument */
    if (typeof customTheme !== 'undefined') {
        this.themeType = CUSTOM_TH;
        this.customTheme = customTheme;
    }
}

/*
*****************************************
**** Log Level Functions ****************
*****************************************
*/

TransLoggerUtil.prototype.debug = function (msg, opts) {
    let theme = this.getDebugTheme();
    if (process.env.DEBUG_LEVEL && process.env.DEBUG_LEVEL === 'DEBUG') console.log(theme(this.formatMsg(msg, opts)));
};

TransLoggerUtil.prototype.info = function (msg, opts) {
    let theme = this.getInfoTheme();
    if (process.env.DEBUG_LEVEL && (process.env.DEBUG_LEVEL === 'INFO' || process.env.DEBUG_LEVEL === 'DEBUG')) console.log(theme(this.formatMsg(msg, opts)));
};

TransLoggerUtil.prototype.warn = function (msg, opts) {
    let theme = this.getWarnTheme();
    if (process.env.DEBUG_LEVEL && process.env.DEBUG_LEVEL !== 'ERROR') console.log(theme(this.formatMsg(msg, opts)));
};

TransLoggerUtil.prototype.error = function (msg, opts, err) {
    let theme = this.getErrorTheme();
    if (msg) console.log(theme(this.formatMsg(msg)));
    if (err) {
        if (!msg) console.log(theme(this.formatMsg('An Error occurred')));
        console.error(err);
    }
    if (exit) process.exit(1);
};

/*
*****************************************
**** Format Functions *******************
*****************************************
*/

TransLoggerUtil.prototype.formatMsg = function (msg, opts) {
    if (typeof msg === 'undefined') return '';

    if (msg.substring(0, _call_out_trigger.length) === _call_out_trigger) {
        return formatCallOut(msg);
    }

    return (typeof this.src !== 'undefined' && (!opts || !opts.noSrc) ? this.src : '')
        + wrapper(msg, _line_max_len, '\n' + _indentation_4);
};

const formatCallOut = function (msg) {
    if (typeof msg === 'undefined') return '';

    let callOutBar = '\n' + Array(_call_out_padder_len + 1).join(_call_out_padder_char) + '\n';
    let result = msg.replace(_call_out_regex, ' ') + ' ';
    return callOutBar
        + padder(result, _call_out_padder_len, _call_out_padder_char, _padder_both)
        + callOutBar;
};

const formatSrc = function (src) {
    if (typeof src === 'undefined') src = _src_default;
    let truncatedSrc = truncateSrc(src);
    src = (_src_pad_left + truncatedSrc);
    return src;
};

const truncateSrc = function (src) {
    if (typeof src === 'undefined') return '';

    let result = src + '\n    ';
    if (src.length > _src_max_len) {
        result = src.substring(0, (_src_max_len - 4));
        result = result + '...:';
    }

    return result;
};

const wrapper = function (msg, len = 76, lbr = '\n', cut = true) {
    len >>>= 0;
    if (0 === len || msg.length <= len) {
        return msg;
    }
    return msg.split('\n').map(line => {
        if (line.length <= len) {
            return line;
        }

        let words = line.split(' ');
        if (cut) {
            let temp = [];
            for (const word of words) {
                if (word.length > len) {
                    let i = 0;
                    const length = word.length;
                    while (i < length) {
                        temp.push(word.slice(i, Math.min(i + len, length)));
                        i += len;
                    }
                } else {
                    temp.push(word);
                }
            }
            words = temp;
        }
        let wrapped = words.shift();
        let spaceLeft = len - wrapped.length;
        for (const word of words) {
            if (word.length + 1 > spaceLeft) {
                wrapped += lbr + word;
                spaceLeft = len - word.length;
            } else {
                wrapped += ' ' + word;
                spaceLeft -= 1 + word.length;
            }
        }
        return wrapped;
    }).join('\n');
};

const padder = function (msg, len, pad, side) {
    if (typeof msg === 'undefined') return '';
    if (typeof len === 'undefined') len = 0;
    if (typeof pad === 'undefined') pad = ' ';
    if (typeof side === 'undefined') side = _padder_left;

    if (len + 1 >= msg.length) {
        switch (side) {
            case _padder_left:
                msg = Array(len + 1 - msg.length).join(pad) + msg;
                break;
            case _padder_both:
                let pad_len = len - msg.length;
                let right = Math.ceil(pad_len / 2);
                let left = pad_len - right;
                msg = Array(left + 1).join(pad) + msg + Array(right + 1).join(pad);
                break;
            case _padder_right:
            default:
                msg = msg + Array(len + 1 - msg.length).join(pad);
                break;
        }
    } else {
        console.log('WARNING: TransLoggerUtil msg length exceeds padding length\n'
            + '[ '
            + (len + 1) + ' >= ' + msg.length + ', '
            + msg.substring(0, 16) + '...'
            + '].'
        );
    }

    return msg;
};

/*
*****************************************
****  Theme Functions *******************
*****************************************
*/

TransLoggerUtil.prototype.getDebugTheme = function () {
    switch (this.themeType) {
        case SSR_TH:
            return debugTheme.ssr;
        case SSR_BG_TH:
            return debugTheme_bg.ssr;
        case CUSTOM_TH:
            if (this.customTheme) return this.customTheme;
            return infoTheme.default;
        case CLIENT_BG_TH:
        case DEFAULT_BG_TH:
            return debugTheme_bg.default;
        case DEFAULT_TH:
        case CLIENT_TH:
        default:
            return debugTheme.default;
    }
};

TransLoggerUtil.prototype.getInfoTheme = function () {
    switch (this.themeType) {
        case SSR_TH:
            return infoTheme.ssr;
        case SSR_BG_TH:
            return infoTheme_bg.ssr;
        case CUSTOM_TH:
            if (this.customTheme) return this.customTheme;
            return infoTheme.default;
        case CLIENT_BG_TH:
        case DEFAULT_BG_TH:
            return infoTheme_bg.default;
        case DEFAULT_TH:
        case CLIENT_TH:
        default:
            return infoTheme.default;
    }
};

TransLoggerUtil.prototype.getWarnTheme = function () {
    switch (this.themeType) {
        case SSR_TH:
            return warnTheme.ssr;
        case SSR_BG_TH:
            return warnTheme_bg.ssr;
        case CUSTOM_TH:
            if (this.customTheme) return this.customTheme;
            return infoTheme.default;
        case CLIENT_BG_TH:
        case DEFAULT_BG_TH:
            return warnTheme_bg.default;
        case DEFAULT_TH:
        case CLIENT_TH:
        default:
            return warnTheme.default;
    }
};

TransLoggerUtil.prototype.getErrorTheme = function () {
    switch (this.themeType) {
        case SSR_TH:
            return errorTheme.ssr;
        case SSR_BG_TH:
            return errorTheme_bg.ssr;
        case CUSTOM_TH:
            if (this.customTheme) return this.customTheme;
            return infoTheme.default;
        case 'CLIENT_BG':
        case 'DEFAULT_BG':
            return errorTheme_bg.default;
        case 'DEFAULT':
        case 'CLIENT':
        default:
            return errorTheme.default;
    }
};

module.exports = TransLoggerUtil;