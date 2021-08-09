module.exports = function (client, id, resolution) {

    var request = {
        id: id,
        resolution: resolution
    }

    client.publish(`stat/${process.env.DEVICE_NAME}/alarmcenter/resolutionrequest`,
        JSON.stringify(request));
    
    return true;
};