const hass = require('homeassistant-ws').default;

haClient = async function (listener) {

    const client = await hass({
        token: `${process.env.HA_TOKEN}`,
        host: `${process.env.HA_ADDRESS}`,
        path: '/api/websocket',
    }).catch(error => { console.log('caught', error.message) });

    if (undefined !== client) {

        client.on('state_changed', listener);
    }
};
module.exports =    haClient;