const Subscriber = require('./base');
const Messages = require('../../models/messages');
const { client } = require('../mqttsubscriber');

const ALERT_STATUS = ['critical', 'warning', 'nominal'];

class StatusMessageSubscriber extends Subscriber
{   
    alertLevel = 9999;

    static pattern = 'stat/homecenter/message/#';
    constructor() {
        super(StatusMessageSubscriber.pattern);
    }

    obtainid( topic )  {
        return topic.replace(StatusMessageSubscriber.pattern.split('/').slice(0,-1).join('/') + '/', '');
    }


    adjustAlertLevel(message, client) {
        if (undefined !== message.level) {

            if (this.alertLevel > message.level) {
                this.alertLevel = message.level;

                var alert = {
                    status : ALERT_STATUS[this.alertLevel-1],
                    level : this.alertLevel
                }

                client.publish('cmnd/ALARM_CENTER_DEV/alarmcenter/statusindicator', 
                    JSON.stringify(alert),{
                        retain : true
                    });
            }

        } else {
            message.level = 3;
        }

        return message;
    }
    

    handle(/* string */ topic, /* string */ message, /* object */ client) {

        var status = JSON.parse(message.toString());
        status.id = this.obtainid(topic);
        status = this.adjustAlertLevel(status, client);
        //console.debug(status);

        var messages = Messages.read();
        messages.add(status.id, status);
        messages.write();
    }
}


module.exports = new StatusMessageSubscriber();