'use strict';


/*
Author: Mark Zlamal (IBM Canada)
*/


const TIMEOUT_MAX = 30000; // 30 seconds;


let TimeoutHandle = null;
let AccessToken = null;



module.exports = async APIKey => {
    if (!APIKey) {
        clearTimeout(TimeoutHandle);
        return;
    };

    if (AccessToken) {
        return AccessToken;
    };

    const Requests = require('./Requests');
    const FreshToken = await Requests.DoRequestPost({
        URL: 'https://iam.cloud.ibm.com/identity/token',
        DataForm: {
            grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
            apikey: APIKey
        }
    });


    TimeoutHandle = setTimeout(() => {
        AccessToken = null;
    }, TIMEOUT_MAX);

    AccessToken = FreshToken.access_token;

    return AccessToken;
};