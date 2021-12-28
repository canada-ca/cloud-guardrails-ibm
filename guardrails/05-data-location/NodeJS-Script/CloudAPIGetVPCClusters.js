'use strict';


/*
Author: Mark Zlamal (IBM Canada)
*/


module.exports = async req => {

    const CloudAPISignIn = require('./CloudAPISignIn');
    const myAccountInfo = await CloudAPISignIn(req);

    const Requests = require('./Requests');
    const myResults = await Requests.DoRequestGet({
        URL: `https://containers.cloud.ibm.com/global/v2/vpc/getClusters`,
        Headers: {
            Authorization: myAccountInfo.AccessToken
        }
    });

    return myResults;
};