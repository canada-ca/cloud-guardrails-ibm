'use strict';


/*
Author: Mark Zlamal (IBM Canada)
*/


function CreateJSONTable(tableString) {

    const Headers = [];
    const myJSONRows = []

    const rows = tableString.split('\n');
    rows.forEach((row, index) => {
        const parts = row.trim().split(' ');

        const currentRowData = {};

        let headerIndex = 0;
        parts.forEach(sourcePart => {
            const part = sourcePart.trim();
            if (part.length <= 0) {
                return;
            };

            if (index === 0) {
                Headers.push(part);
            } else {
                if (headerIndex === 0) {
                    myJSONRows.push(currentRowData);
                };
                currentRowData[Headers[headerIndex]] = part;
            };

            headerIndex++;
        });
    });

    return myJSONRows;
};



function MakeVLANDetail(myVLANDetailString) {

    const myJSONDetailObj = {};

    const rows = myVLANDetailString.split('\n');
    rows.forEach((row, index) => {
        if (index === 0) {
            return;
        };
        const parts = row.trim().split(' ');

        let partKey;
        let partValue;
        parts.forEach((sourcePart, index) => {
            const part = sourcePart.trim();
            if (part.length <= 0) {
                return;
            };

            if (index === 0) {
                partKey = part;
            } else {
                partValue = part;
            };
        });
        myJSONDetailObj[partKey] = partValue;
    });

    return myJSONDetailObj;
};


function IssueCLICommand(commandString) {
    return new Promise((resolve, reject) => {
        console.log(`Issuing : ${commandString}`);
        const ChildProcess = require('child_process');
        ChildProcess.exec(commandString, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            };
            resolve(stdout);
        });
    });
};


module.exports = async() => {

    const ListOfVLANs = await IssueCLICommand('ibmcloud sl vlan list');

    const myVLANTable = CreateJSONTable(ListOfVLANs);

    for (const VLAN_row of myVLANTable) {
        const DetailOfVLAN = await IssueCLICommand(`ibmcloud sl vlan detail ${VLAN_row.ID}`);
        VLAN_row.DETAIL = MakeVLANDetail(DetailOfVLAN);
    };

    return myVLANTable;
};