const ALERT_STATUS = ['critical', 'warning', 'nominal'];


module.exports = function (client, level, expires) {

    if (false !== level) {
        var alert = {
            status: ALERT_STATUS[level - 1],
            level: level
        }
    
        if (undefined !== expires) {
            alert.expires = expires;
        }

        client.publish('cmnd/ALARM_CENTER_DEV/alarmcenter/statusindicator',
            JSON.stringify(alert), {
            retain: true
        });
    }
};