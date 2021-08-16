const mqtt = require('mqtt');
const MqttSubscriber = require('./mqtt/mqttsubscriber');



mqttClient = function() {

    var client  = mqtt.connect({
        host : process.env.MQTT_BROKER,
        port : process.env.MQTT_PORT,
        username : process.env.MQTT_USER,
        password : process.env.MQTT_PASSWORD
    });
    MqttSubscriber.client = client;
    
    client.on('error', function(err) {
        console.error("Cannot Connect to MQTT Server");
        console.error(err);
        console.error(process.env.MQTT_USER);
        //console.error(process.env.MQTT_PASSWORD);

    });
 
    console.log(`tele/${process.env.SERVER_NAME}/reconnected`);
    
    client.publish(`tele/${process.env.SERVER_NAME}/reconnected`, JSON.stringify({
        servername: process.env.SERVER_NAME,
    }));

    client.subscribe(MqttSubscriber.getSubscriptions(), function(err, granted) {
        if (err) {
            console.error('Cannot subscribe to messages: ' + err);
        } 
    });

    client.on('message', MqttSubscriber.messageHandler);

    return client;

}

module.exports = mqttClient;