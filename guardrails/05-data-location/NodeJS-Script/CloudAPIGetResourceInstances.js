'use strict';


/*
Author: Mark Zlamal (IBM Canada)
*/


module.exports = async(APIKey, AccountID) => {

    const CloudAPISignIn = require('./CloudAPISignIn');
    const AccessToken = await CloudAPISignIn(APIKey);

    const Requests = require('./Requests');
    const myResults = await Requests.DoRequestGet({
        URL: `https://resource-controller.cloud.ibm.com/v2/resource_instances?account_id=${AccountID}`,
        Headers: {
            Authorization: `Bearer ${AccessToken}`
        }
    });

    return myResults;
};