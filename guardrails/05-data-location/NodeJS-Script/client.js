'use strict';


/*
Author: Mark Zlamal (IBM Canada)
*/


const SampleReqData = {
    ReqType: 'POST', // or 'GET'
    URL: '/asdf',
    DATA: {}, // a JSON object (POST only), sent to server as a "DataObj"
};


async function MyAJAX(ReqData) {
    const ajaxData = {
        url: ReqData.URL,
        headers: {},
        cache: false,
        processData: false,
        contentType: false
            //		dataType: 'json'
    };

    if (ReqData.ReqType === 'GET') {
        ajaxData.type = 'GET';
    } else {
        ajaxData.type = 'POST';
        ajaxData.enctype = 'multipart/form-data';

        const formData = new FormData();

        if (ReqData.DATA) {
            formData.append('DataObj', JSON.stringify(ReqData.DATA));
        };

        ajaxData.data = formData;
    };

    return await new Promise((resolve, reject) => {
        $.ajax(ajaxData).done((dataObj, textStatus, jqXHR) => resolve(dataObj)).fail((jqXHR, textStatus, errorThrown) => {
            reject(new Error(`FATAL (AJAX I/O Failed), ${textStatus}, ${errorThrown} for '${ajaxData.url}'.`));
        });
    });
};



$(() => {
    $('#GetUsers').click(() => {
        const Params = {
            ReqType: 'GET',
            URL: `/GetUsers?APIKey=${$('#api_key').val()}&AccountID=${$('#account_id').val()}`
        };
        MyAJAX(Params).then(rawText => {
            const TheJSONObj = JSON.parse(rawText);
            const content = JSON.stringify(TheJSONObj, null, '  ');
            $('#UsersRes').css('color', 'black');
            $('#UsersRes').html(`${content}`);
        }).catch(err => {
            $('#UsersRes').css('color', 'red');
            $('#UsersRes').html(`${err.message}\n${err.stack}`);
        });
    });


    $('#GetResourceGroups').click(() => {
        const Params = {
            ReqType: 'GET',
            URL: `/GetResourceGroups?APIKey=${$('#api_key').val()}&AccountID=${$('#account_id').val()}`
        };
        MyAJAX(Params).then(rawText => {
            const TheJSONObj = JSON.parse(rawText);
            const content = JSON.stringify(TheJSONObj, null, '  ');
            $('#ResourceGroupsRes').css('color', 'black');
            $('#ResourceGroupsRes').html(`${content}`);
        }).catch(err => {
            $('#ResourceGroupsRes').css('color', 'red');
            $('#ResourceGroupsRes').html(`${err.message}\n${err.stack}`);
        });
    });


    $('#GetResourceInstances').click(() => {
        const Params = {
            ReqType: 'GET',
            URL: `/GetResourceInstances?APIKey=${$('#api_key').val()}&AccountID=${$('#account_id').val()}`
        };
        MyAJAX(Params).then(content => {
            const resourceJSON = JSON.parse(content);

            const myResources = [];
            resourceJSON.resources.forEach(item => {
                const CanadianResources = ['CANADA', 'CANADIAN', 'US-EAST', 'CA-', 'TOR', 'MTL'];
                const TestLocation = item.region_id.toUpperCase();
                const inCanada = CanadianResources.find(item => TestLocation.startsWith(item) || item.includes(TestLocation));
                if (inCanada) {
                    myResources.push(`<span style='color: #006600;background: white;'>${item.name} (${item.type}): ${item.region_id}`);
                } else {
                    const AgnosticLocationIdentifiers = ['GLOBAL'];
                    const isLocationAgnostic = AgnosticLocationIdentifiers.find(item => item === TestLocation);
                    if (isLocationAgnostic) {
                        myResources.push(`<span style='color:black;background: yellow;'>${item.name} (${item.type}): ${item.region_id}`);
                    } else {
                        myResources.push(`<span style='color:white;background: red;'>${item.name} (${item.type}): ${item.region_id}`);
                    };
                };
            });
            $('#ResourceInstancesRes').html(myResources.join('\n'));
        }).catch(err => {
            $('#ResourceInstancesRes').css('color', 'red');
            $('#ResourceInstancesRes').html(`${err.message}\n${err.stack}`);
        });

    });



    $('#GetVLANs').click(() => {
        const Params = {
            ReqType: 'GET',
            URL: `/GetVLANs`
        };
        MyAJAX(Params).then(rawText => {
            const TheJSONObj = JSON.parse(rawText);
            const content = JSON.stringify(TheJSONObj, null, '  ');
            $('#VLANsRes').css('color', 'black');
            $('#VLANsRes').html(`${content}`);
        }).catch(err => {
            $('#VLANsRes').css('color', 'red');
            $('#VLANsRes').html(`${err.message}\n${err.stack}`);
        });
    });


    $('#GetVPCClusters').click(() => {
        const Params = {
            ReqType: 'GET',
            URL: `/GetVPCClusters?APIKey=${$('#api_key').val()}&AccountID=${$('#account_id').val()}`
        };
        MyAJAX(Params).then(rawText => {
            const TheJSONObj = JSON.parse(rawText);
            const content = JSON.stringify(TheJSONObj, null, '  ');
            $('#VPCClustersRes').css('color', 'black');
            $('#VPCClustersRes').html(`${content}`);
        }).catch(err => {
            $('#VPCClustersRes').css('color', 'red');
            $('#VPCClustersRes').html(`${err.message}\n${err.stack}`);
        });
    });


});