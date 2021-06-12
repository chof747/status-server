module.exports = function (client, id, resolution) {

    var request = {
        id: id,
        resolution: resolution
    }

    client.publish('stat/ALARM_CENTER_DEV/alarmcenter/resolutionrequest',
        JSON.stringify(request));
    
    return true;
};