//https://cloud.ibm.com/docs?tab=api-docs&subCategory=account&category=platform_services


/*
Author: Mark Zlamal (IBM Canada)
*/


async function GetAllResourceInstances(req, res) {
    const myResults = await REQUESTS.DoRequestGet({
        URL: `https://resource-controller.cloud.ibm.com/v2/resource_instances?account_id=${MyACCOUNT}`,
        Headers: {
            Authorization: `Bearer ${ActiveToken.access_token}`
        }
    });

    res.end(JSON.stringify(myResults, null, '\t'));
};



function ShowHomePage(req, res) {
    const FS = require('fs');
    const myFileData = FS.readFileSync('./index.html');
    res.end(myFileData);
};


function LoadClientJS(req, res) {
    const FS = require('fs');
    const myFileData = FS.readFileSync('./client.js');
    res.end(myFileData);
}


function RouteHandler(req, res) {
    const URLQuery = new URL(req.url, 'http://void.com');
    const APIKey = URLQuery.searchParams.get('APIKey');
    const AccountID = URLQuery.searchParams.get('AccountID');

    if (URLQuery.pathname === '/') {
        return ShowHomePage(req, res);
    };

    if (URLQuery.pathname === '/GetUsers') {
        const theAPI = require('./CloudAPIGetUsers');
        return theAPI(APIKey, AccountID).then(results => res.end(JSON.stringify(results)));
    };

    if (URLQuery.pathname === '/GetResourceGroups') {
        const theAPI = require('./CloudAPIGetResourceGroups');
        return theAPI(APIKey, AccountID).then(results => res.end(JSON.stringify(results)));
    };

    if (URLQuery.pathname === '/GetResourceInstances') {
        const theAPI = require('./CloudAPIGetResourceInstances');
        return theAPI(APIKey, AccountID).then(results => res.end(JSON.stringify(results)));
    };

    if (URLQuery.pathname === '/GetVLANs') {
        const theAPI = require('./CloudCLIGetVLANs');
        return theAPI(req).then(results => res.end(JSON.stringify(results)));
    };

    if (URLQuery.pathname === '/GetVPCClusters') {
        const theAPI = require('./CloudAPIGetVPCClusters');
        return theAPI(req).then(results => res.end(JSON.stringify(results)));
    };

    if (URLQuery.pathname === '/client.js') {
        return LoadClientJS(req, res);
    }

    console.log(`Did not process Request: ${req.url}`);

    res.end();
};


if (process.argv.find(item => item === '-toFile')) {

    const AccountIDTagIndex = process.argv.findIndex(item => item === '-AccountID');
    const APIKeyTagIndex = process.argv.findIndex(item => item === '-APIKey');

    if (!AccountIDTagIndex || !APIKeyTagIndex || process.argv.length < (1 + Math.max(AccountIDTagIndex, APIKeyTagIndex))) {
        console.log('USAGE: node . -toFile -APIKey <your-api-key> -AccountID <your-account-id>');
        return;
    };

    const APIKey = process.argv[APIKeyTagIndex + 1];
    const AccountID = process.argv[AccountIDTagIndex + 1];

    console.log(process.argv);
    console.log(AccountIDTagIndex, APIKeyTagIndex);
    console.log(APIKey, AccountID);

    const Results = [];

    async function RunTests() {
        console.log('GetUsers...');
        const GetUsers = require('./CloudAPIGetUsers');
        const UserListJSON = await GetUsers(APIKey, AccountID);
        Results.push(UserListJSON);

        console.log('GetResourceGroups...');
        const GetResourceGroups = require('./CloudAPIGetResourceGroups');
        const ResourceGroupList = await GetResourceGroups(APIKey, AccountID);
        Results.push(ResourceGroupList);

        console.log('GetResourceInstances...');
        const GetResourceInstances = require('./CloudAPIGetResourceInstances');
        const ResourceInstanceList = await GetResourceInstances(APIKey, AccountID);
        console.log(ResourceInstanceList);
        const CanadianResources = ['CANADA', 'CANADIAN', 'US-EAST', 'CA-', 'TOR', 'MTL'];
        for (const resourceInfo of ResourceInstanceList.resources) {
            const TestLocation = resourceInfo.region_id.toUpperCase();
            const inCanada = CanadianResources.find(item => TestLocation.startsWith(item) || item.includes(TestLocation));
            if (inCanada) {
                resourceInfo.GuardRailPassed = true;
            } else {
                resourceInfo.GuardRailPassed = false;
            };
        };
        Results.push(ResourceInstanceList);

        // Kill the timeout
        const CloudAPISignIn = require('./CloudAPISignIn');
        await CloudAPISignIn();
    };

    RunTests().then(() => {
        const OutputFilename = 'Results-guardrail-05.txt';
        console.log(`Saving to file: ${OutputFilename}`);

        const FS = require('fs');
        FS.writeFileSync(OutputFilename, JSON.stringify(Results, null, 2));

        console.log('All Done.');
    });

} else {
    const HTTP = require('http');
    const HTTPServerListener = HTTP.createServer(RouteHandler);

    const ThePort = 3002;

    HTTPServerListener.listen(ThePort, null, null, () => {
        console.log(`Running Web UI: http://localhost:${ThePort}`);
    });
};






// return request(options)
//   .then((response) => {
//     myCache.set('access_token', response.access_token, TOKEN_CACHE_IN_SECONDS);
//     return response.access_token
//   })
//   .catch(function (err) {
//     console.log("ERROR ", err);
//   });
//   },




// const request = require('request-promise');
// const fs = require('fs');
// const NodeCache = require('node-cache');
// const myCache = new NodeCache({
//   useClones: false // so that we can alter the clusters between calls
// });
// const AwaitLock = require('await-lock');
// // to prevent concurrent calls to sensitive APIs
// const apiLock = new AwaitLock();

// // cache the list of clusters
// const CLUSTER_CACHE_IN_SECONDS = 60 * 60;

// // cache the IAM and CF tokens
// const TOKEN_CACHE_IN_SECONDS = 60;

// function mapCloudFoundryRegion(region) {
//   if (region === 'us-south') {
//     return 'ng';
//   } else {
//     return region;
//   }
// }

// function sanitizeForTag(tag) {
//   // tags should match : /^[A-Za-z0-9_ .-]+[:]{1}[A-Za-z0-9_ .-]+$|^[A-Za-z0-9_ .-]+$/
//   let result = '';
//   for (const c of tag) {
//     if (
//       (c >= 'A' && c <= 'Z') ||
//       (c >= 'a' && c <= 'z') ||
//       (c >= '0' && c <= '9') ||
//       (c === '_') ||
//       (c === '.') ||
//       (c === '-')
//     ) {
//       result = result + c;
//     } else {
//       result = result + '_';
//     }
//   }
//   return result;
// }

// const Mustache = require('mustache');
// const welcomeEmailTemplate = fs.readFileSync('./mail.template.html').toString();
// const inviteUserTemplate = fs.readFileSync('./invite.template.json').toString();

// const API = {
//   getClusters: async (token) => {
//     let clusters = myCache.get(`clusters`);
//     if (clusters) {
//       console.log(`[api] using cached clusters`);
//     } else {
//       clusters = await API.cacheClustersAndTags(token);
//     }
//     return clusters;
//   },
//   cacheClustersAndTags: async (token) => {
//     // find all clusters
//     const clusters = await API.getClustersFromAPI(token);
//     console.log(clusters);
//     // retrieve tags for every cluster
//     for (let i = 0; i < clusters.length; i++) {
//       const tags = (await API.getTags(token, clusters[i])).items;
//       console.log(clusters[i].name, tags);
//       clusters[i].tags = tags;
//     }

//     myCache.set(`clusters`, clusters, CLUSTER_CACHE_IN_SECONDS);

//     return clusters;
//   },

//   clearCache: () => {
//     console.log('[api] Clearing caches');
//     myCache.flushAll();
//   },

//   // Get Token using the API Key
//   getToken: async (apikey) => {
//     console.log('[api] Getting IAM token');
//     let cachedToken = myCache.get('access_token')
//     if (cachedToken !== undefined) {
//       console.log('[api] Using cached IAM token');
//       return cachedToken;
//     }
//     var options = {
//       method: 'POST',
//       url: 'https://iam.cloud.ibm.com/identity/token',
//       json: true,
//       headers:
//       {
//         Accept: 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       form:
//       {
//         grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
//         apikey
//       }
//     };

//     return request(options)
//       .then((response) => {
//         myCache.set('access_token', response.access_token, TOKEN_CACHE_IN_SECONDS);
//         return response.access_token
//       })
//       .catch(function (err) {
//         console.log("ERROR ", err);
//       });
//   },
//   // Invite user to IBM account
//   inviteUser: async (inviteConfig, token) => {
//     console.log(`[api] Invite user ${inviteConfig.email} to account`);

//     // augment with allocated resources
//     inviteConfig.allocated = {};

//     // create a namespace for the user
//     if (inviteConfig.allocate.functions) {
//       const userNamespace = await API.createCloudFunctionsNamespace(token, inviteConfig.region, inviteConfig.resourceGroupId, inviteConfig.email);
//       await API.tagResource(token, userNamespace.crn, inviteConfig.filterTag);
//       inviteConfig.allocated.functions = {
//         namespace: userNamespace
//       }
//     }

//     // pick a cluster for the user
//     if (inviteConfig.allocate.cluster) {
//       inviteConfig.allocated.cluster = await API.assignCluster(token, inviteConfig.accountId, inviteConfig.filterTag, inviteConfig.email);
//     }

//     inviteBody = JSON.parse(Mustache.render(inviteUserTemplate, {
//       config: inviteConfig,
//       hasIamPolicies: function () {
//         return inviteConfig.allocated.functions || inviteConfig.allocated.cluster;
//       }
//     }));

//     var options = {
//       method: 'POST',
//       url: `https://user-management.cloud.ibm.com/v2/accounts/${inviteConfig.accountId}/users`,
//       headers:
//       {
//         'Authorization': token,
//         'content-type': 'application/json'
//       },
//       body: inviteBody,
//       json: true
//     }
//     return request(options);
//   },
//   // Remove User to the IBM Account
//   removeUser: (token, account, iamID) => {
//     console.log(`[api] Removing user ${iamID} from account`);
//     var options = {
//       method: 'DELETE',
//       url: 'https://user-management.cloud.ibm.com/v2/accounts/' + account + '/users/' + iamID,
//       headers:
//       {
//         'Authorization': token,
//         'content-type': 'application/json'
//       },
//       json: true
//     }
//     return request(options);
//   },
//   // Get all clusters
//   getClustersFromAPI: async (token) => {
//     console.log(`[api] Retrieving all clusters`);

//     v1Clusters = await request({
//       method: 'GET',
//       url: 'https://containers.cloud.ibm.com/global/v2/classic/getClusters',
//       json: true,
//       headers:
//       {
//         Authorization: token
//       }
//     });

//     v2Clusters = await request({
//       method: 'GET',
//       url: 'https://containers.cloud.ibm.com/global/v2/vpc/getClusters',
//       json: true,
//       headers:
//       {
//         Authorization: token
//       }
//     });

//     clusters = v1Clusters.concat(v2Clusters);
//     clusters.forEach((cluster) => {
//       cluster.crn = `crn:v1:bluemix:public:containers-kubernetes:${cluster.region}:a/${process.env.ACCOUNT}:${cluster.id}::`
//     });
//     return clusters;
//   },
//   cacheClusters: async (token) => {
//     console.log(`[api] Caching clusters`);
//     await apiLock.acquireAsync();
//     try {
//       await API.cacheClustersAndTags(token);
//     } finally {
//       // release the lock no matter what
//       apiLock.release();
//     }
//   },
//   deleteCluster: async (token, resourceGroup, clusterID) => {
//     console.log(`[api] Deleting cluster ${clusterID}, RG ${resourceGroup}`);
//     var options = {
//       method: 'DELETE',
//       url: `https://containers.cloud.ibm.com/global/v1/clusters/${clusterID}?deleteResources=true`,
//       headers:
//       {
//         Authorization: token,
//         'X-Auth-Resource-Group': resourceGroup
//       }
//     };
//     return request(options);

//   },
//   assignCluster: async (token, accountId, filterTag, email) => {
//     console.log(`[api] Finding a cluster for ${email}`);
//     await apiLock.acquireAsync();
//     // the next block is critical,
//     // we don't want to have multiple users calling this at the same time
//     try {
//       let clusters = myCache.get(`clusters`);
//       if (clusters) {
//         console.log(`[api] using cached clusters`);
//       } else {
//         clusters = await API.cacheClustersAndTags(token);
//       }

//       // if filter tag is set, keep only the clusters with this tag
//       // this makes it possible to have multiple "grant cluster" deployed
//       // in the same account without conflicting
//       if (filterTag) {
//         clusters = clusters.filter((cluster) => {
//           return cluster.tags && cluster.tags.filter((tag) => {
//             return tag.name == filterTag;
//           }).length > 0;
//         });
//       }

//       // check if user already has a cluster assigned
//       // Back door - this doesn't ignore case ;)  johndoe@gmail.com != johnDOE@gmail.com
//       const alreadyAssignedCluster = clusters.find((cluster) => {
//         for (x in cluster.tags) {
//           if (cluster.tags[x].name == sanitizeForTag(email)) {
//             return true;
//           }
//         }
//       })
//       if (alreadyAssignedCluster) {
//         console.log(`${email} already has ${alreadyAssignedCluster.name} assigned`);
//         return alreadyAssignedCluster;
//       }

//       // find a cluster not tagged
//       const clusterToAssign = clusters.find((cluster) => {
//         if (filterTag) {
//           if (cluster.tags.length === 1 && cluster.tags[0].name === filterTag) {
//             return true;
//           } else {
//             console.log(`>>> Ignoring cluster ${cluster.name} (not tagged or already in use)`);
//             return false;
//           }
//         } else if (cluster.tags.length === 0) {
//           return true;
//         }
//       });

//       if (clusterToAssign) {
//         console.log(`Selected ${clusterToAssign.name} for ${email}`);
//       } else {
//         throw new Error('No unassigned clusters found!');
//       }

//       // Tag the cluster with the iamID
//       const tag = sanitizeForTag(email);
//       await API.tagResource(token, clusterToAssign.crn, tag)

//       // tag the cluster in-memory too so it won't be reused on next call
//       clusterToAssign.tags.push({ name: tag });

//       return clusterToAssign;
//     } finally {
//       // release the lock no matter what
//       apiLock.release();
//     }
//   },

//   getAllUsers: (token, account) => {
//     console.log(`[api] Retrieving all users in account`);
//     var options = {
//       method: 'GET',
//       json: true,
//       url: `https://user-management.cloud.ibm.com/v2/accounts/${account}/users`,
//       // qs: { user_id: email },
//       headers:
//       {
//         'Content-Type': 'application/json',
//         Authorization: token
//       }
//     };
//     return request(options).then(response => response.resources);
//   },

//   getMembers: (token, accessGroupId) => {
//     console.log(`[api] Retrieving members in access group `);
//     var options = {
//       method: 'GET',
//       json: true,
//       url: `https://iam.cloud.ibm.com/v2/groups/${accessGroupId}/members`,
//       headers:
//       {
//         'Content-Type': 'application/json',
//         Authorization: token
//       }
//     };
//     return request(options).then(response => response.members);
//   },

//   getTags: async (token, cluster) => {
//     console.log(`[api] getTags for ${cluster.name} / ${cluster.crn}`)
//     var options = {
//       method: 'GET',
//       url: 'https://tags.global-search-tagging.cloud.ibm.com/v3/tags',
//       json: true,
//       qs: {
//         providers: 'ghost',
//         attached_to: cluster.crn
//       },
//       headers: {
//         Authorization: `bearer ${token}`,
//         accept: 'application/json'
//       }
//     };

//     return request(options);
//   },

//   tagResource: (token, crn, tag) => {
//     console.log(`[api] tagResource ${crn} with ${tag}`);
//     var options = {
//       method: 'POST',
//       json: true,
//       url: 'https://tags.global-search-tagging.cloud.ibm.com/v3/tags/attach',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `bearer ${token}`,
//         accept: 'application/json'
//       },
//       body: {
//         tag_name: tag,
//         resources: [{ resource_id: crn }]
//       }
//     };

//     return request(options);
//   },

//   deleteTag: async (token, tagName, clusterCRN) => {
//     console.log(`[api] detach ${tagName} from cluster.crn=${clusterCRN} `);
//     var options = {
//       method: 'POST',
//       json: true,
//       url: 'https://tags.global-search-tagging.cloud.ibm.com/v3/tags/detach',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `bearer ${token}`,
//         accept: 'application/json'
//       },
//       body: {
//         tag_name: tagName,
//         resources: [{ resource_id: clusterCRN }]
//       }
//     };
//     return request(options);

//   },

//   // Create a new Cloud Functions namespace
//   createCloudFunctionsNamespace: (token, region, resourceGroupId, email) => {
//     console.log('[api] createCloudFunctionsNamespace');
//     var options = {
//       method: 'POST',
//       url: `https://${region}.functions.cloud.ibm.com/servicebroker/api/v1/namespaces`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `bearer ${token}`,
//       },
//       body: {
//         name: sanitizeForTag(email),
//         description: `namespace for ${email}`,
//         resource_plan_id: 'functions-base-plan',
//         resource_group_id: resourceGroupId,
//       },
//       json: true,
//     };
//     // response body
//     // {
//     // "id":"xxx",
//     // "name":"to-delete",
//     // "description":"mydescription",
//     // "resource_plan_id":"functions-base-plan",
//     // "service_id":"sss",
//     // "api_key_id":"aaa",
//     // "api_key_created":"2019-12-19T16:27:07.162886028Z",
//     // "resource_group_id":"rrr",
//     // "crn":"ccc",
//     // "location":"us-south"
//     // }
//     return request(options);
//   },

//   notifyUser: (sendGridAPIKey, from, subject, email, view) => {
//     console.log(`[api] notifyUser ${email}`);
//     const sgMail = require('@sendgrid/mail');
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//       to: email,
//       from,
//       subject,
//       html: Mustache.render(welcomeEmailTemplate, view),
//     };
//     sgMail.send(msg);
//   }
// }

// module.exports = API;