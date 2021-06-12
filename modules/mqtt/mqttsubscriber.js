var handlers = {};

const statusMessage = require('./subscribers/statusMessage');
handlers[statusMessage.pattern] = statusMessage;


class MqttSubscriber 
{
    static client = null;

    static messageHandler(/* string */ topic, /* string */ message) {

        for(const [pattern, handler] of Object.entries(handlers)) {
            if (handler.isResponsible(pattern)) {
                handler.handle(topic, message, MqttSubscriber.client);
            }
        }

    }

    static getSubscriptions() {
        return Object.keys(handlers);
    }
};

module.exports = MqttSubscriber;