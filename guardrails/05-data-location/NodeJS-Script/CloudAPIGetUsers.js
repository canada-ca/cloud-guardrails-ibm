'use strict';


/*
Author: Mark Zlamal (IBM Canada)
*/


module.exports = async(APIKey, AccountID) => {

    const CloudAPISignIn = require('./CloudAPISignIn');
    const AccessToken = await CloudAPISignIn(APIKey);

    const Requests = require('./Requests');
    const myResults = await Requests.DoRequestGet({
        URL: `https://user-management.cloud.ibm.com/v2/accounts/${AccountID}/users`,
        Headers: {
            Authorization: AccessToken
        }
    });

    return myResults;
};