'use strict';


/*
Author: Mark Zlamal (IBM Canada)
*/


const GET_METHOD_STR = 'GET';
const POST_METHOD_STR = 'POST';

const INITIALDATA_TIMEOUT = 55000;
const INITIALCONN_TIMEOUT = 55000;


function DoRequest(methodStr, reqParams) {
    return new Promise((resolve, reject) => {

        let ReqObj = null;
        let timeoutObj = null;

        function stopTimeout() {
            if (timeoutObj) {
                clearTimeout(timeoutObj);
                timeoutObj = null;
            };
        };

        let ConnTimeoutToApply = INITIALCONN_TIMEOUT;
        if (reqParams.hasOwnProperty('ConnTimeout')) {
            ConnTimeoutToApply = reqParams.ConnTimeout;
        };

        const URLQuery = new URL(reqParams.URL);

        const requestOpts = {
            timeout: ConnTimeoutToApply,
            hostname: URLQuery.hostname,
            port: URLQuery.port, // 443,
            path: `${URLQuery.pathname}${URLQuery.search}`,
            method: methodStr,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
                // 'Accept': '*/*',
                // 'accept-encoding': '*',
                // 'accept-language': '*',
                'Connection': 'keep-alive'
            }
        };

        if (reqParams.Headers) {
            Object.keys(reqParams.Headers).forEach((headerName) => {
                requestOpts.headers[headerName] = reqParams.Headers[headerName];
            });
        };

        let IOInterface;
        if (URLQuery.protocol === 'http:') {
            IOInterface = require('http');
        } else {
            IOInterface = require('https');
        };

        let reqDataString;

        if (methodStr === POST_METHOD_STR) {
            if (reqParams.hasOwnProperty('DataStr')) {
                reqDataString = reqParams.DataStr;
                requestOpts.headers['content-length'] = Buffer.byteLength(reqDataString);
                requestOpts.headers['content-type'] = 'text/plain';
            } else if (reqParams.DataJSON) {
                reqDataString = JSON.stringify(reqParams.DataJSON);
                requestOpts.headers['content-length'] = Buffer.byteLength(reqDataString);
                requestOpts.headers['content-type'] = 'application/json';
            } else if (reqParams.DataForm) {
                // https://nodejs.org/api/querystring.html
                // querystring is deprecated, now use urlsearchparams from WHATWG URL API
                // https://nodejs.org/api/url.html#url_class_urlsearchparams
                const QUERYSTRING = require('querystring');
                reqDataString = QUERYSTRING.stringify(reqParams.DataForm);

                requestOpts.headers['content-length'] = Buffer.byteLength(reqDataString);
                requestOpts.headers['content-type'] = 'application/x-www-form-urlencoded';
            } else {
                return reject(new Error('Post method must contain a DataStr, DataJSON, or DataForm object.'));
            };
        };

        let DataTimeoutToApply = INITIALDATA_TIMEOUT;
        if (reqParams.hasOwnProperty('DataTimeout')) {
            DataTimeoutToApply = reqParams.DataTimeout;
        };

        timeoutObj = setTimeout(() => {
            ReqObj.emit('error', new Error('Request Timeout (Data): ' + reqParams.URL));
        }, DataTimeoutToApply);

        ReqObj = IOInterface.request(requestOpts, myResp => {
            reqParams.ReturnedHeaders = myResp.headers;
            const dataBlocks = [];

            if (reqParams.AsBinary) {
                //				myResp.setEncoding('binary');
                myResp.on('data', (chunk) => {
                    stopTimeout();
                    //					dataBlocks.push(Buffer.from(chunk, 'binary'));
                    dataBlocks.push(chunk);
                });
                myResp.on('end', () => {
                    stopTimeout();
                    const finalData = Buffer.concat(dataBlocks);
                    resolve(finalData);
                });
            } else {
                if (!reqParams.UseICONV) {
                    myResp.setEncoding('utf8');
                };

                myResp.on('data', (chunk) => {
                    stopTimeout();
                    dataBlocks.push(chunk);
                });
                myResp.on('end', () => {
                    stopTimeout();
                    if (reqParams.UseICONV) {
                        const finalData = Buffer.concat(dataBlocks);
                        const ICONV = require('iconv-lite');
                        resolve(ICONV.decode(finalData, 'windows-1252'));
                    } else {
                        const finalData = dataBlocks.join('');
                        const ContentType = reqParams.ReturnedHeaders['content-type'];
                        if (ContentType && ContentType.includes('application/json')) {
                            try {
                                resolve(JSON.parse(finalData));
                            } catch (err) {
                                ReqObj.emit('error', err);
                            };
                        } else {
                            resolve(finalData);
                        };
                    };
                    ReqObj = null;
                });
            };
        });

        ReqObj.on('error', (err) => {
            stopTimeout();
            if (ReqObj) {
                ReqObj.abort();
                ReqObj = null;
            };
            reject(err);
        });

        ReqObj.on('timeout', () => {
            stopTimeout();
            ReqObj.abort();
            ReqObj = null;
            reject(new Error('Request Timeout (Connection): ' + reqParams.URL));
        });

        ReqObj.end(reqDataString);
    });
};


const ExampleGetParams = {
    URL: 'https://abc.com/def?ghi=jkl',
    Headers: { // Optional
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
        'Connection': 'keep-alive'
    }, // Headers may be null or empty. This example header-set is actually added. POST requests also add content-type & content-length
    AsBinary: true, // or false (binary or string data),
    UseICONV: true, // or false (use windows-1252 decoding in webpages, UTF-8-encoded)
    DataTimeout: 5000, // optional MS until initial data received. default is 5000
    ConnTimeout: 5000, // optional MS timeout until socket connection is established
    ReturnedHeaders: [] // returned headers is created!
};

exports.DoRequestGet = params => DoRequest(GET_METHOD_STR, params);

const ExamplePostParams = {
    URL: 'https://abc.com/def?ghi=jkl',
    Headers: { // Optional
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
        'Connection': 'keep-alive'
    }, // Headers may be null or empty. This example header-set is actually added. POST requests also add content-type & content-length
    DataJSON: {
        myDataObjects: 'content JSON tree' // content-type: 'application/json'
    },
    // ... or...
    DataStr: 'string...',
    // ....or...
    DataForm: {
        myDataObjects: 'content JSON tree' // content-type: 'application/x-www-form-urlencoded'
    },
    AsBinary: true, // or false (binary or string data),
    UseICONV: true, // or false (use windows-1252 decoding in webpages, UTF-8-encoded)
    DataTimeout: 5000, // optional MS until initial data received. default is 5000
    ConnTimeout: 5000, // optional MS timeout until socket connection is established
    ReturnedHeaders: [] // returned headers is created!
};


exports.DoRequestPost = params => DoRequest(POST_METHOD_STR, params);