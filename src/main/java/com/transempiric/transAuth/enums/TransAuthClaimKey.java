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

package com.transempiric.transAuth.enums;

import java.util.ArrayList;
import java.util.List;

public enum TransAuthClaimKey {
    CLAIM_KEY_ISSUER("iss"),
    CLAIM_KEY_SUBJECT("sub"),
    CLAIM_KEY_AUDIENCE("aud"),
    CLAIM_KEY_EXPIRATION("exp"),
    CLAIM_KEY_NOT_BEFORE("nbf"),
    CLAIM_KEY_ISSUED_AT("iat"),
    CLAIM_KEY_JWT_ID("jti"),
    CLAIM_KEY_JWT_TOKEN_TYPE("jtt"),
    CLAIM_KEY_JWT_TRANS_USER_AUTHORITY("tua");

    private String key;

    TransAuthClaimKey(String key) {
        this.key = key;
    }

    public static List<String> getKeyList() {
        List<String> claimKeyList = new ArrayList<String>();
        for (TransAuthClaimKey claimKey : TransAuthClaimKey.values()) {
            claimKeyList.add(claimKey.getKey().toLowerCase());
        }
        return claimKeyList;
    }

    public static TransAuthClaimKey getByKey(String key) {
        if (key == null) return null;

        for (TransAuthClaimKey claimKey : TransAuthClaimKey.values()) {
            if (claimKey.key().equalsIgnoreCase(key)) {
                return claimKey;
            }
        }
        return null;
    }

    public String getKey() {
        return key;
    }

    public String key() {
        return key;
    }
}
