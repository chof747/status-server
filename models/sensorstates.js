const SENSORSTATE_FILE = `${process.env.DATADIR}/states.json`;
const fs = require('fs');
const haws = require('../modules/ws')
const md5 = require('md5');


class States {

    #index = {};
    #data = [];

    //************************************************************************************
    constructor() {
    };

    //************************************************************************************
    update(ev) {

        var key = md5(ev.data.entity_id);
        var deviceClass = ev.data.new_state.attributes.device_class;
        if (!(deviceClass in this.#index)) {
            this.#index[deviceClass] = {};
        }

        if (undefined !== deviceClass) {

            var deviceIndex = this.#index[deviceClass];

            if (false == (key in deviceIndex)) {
                deviceIndex[key] = this.addSensor(ev.data.new_state);
            } else {
                this.updateSensor(deviceIndex[key], ev.data.new_state);
            }      
        }

    }

    //************************************************************************************
    historization(/* object */ data) {
        return `${data.last_updated}|${data.state}`;
    }

    //************************************************************************************
    deHistorization(/* string */ entry) {
        return entry.split('|')[0];
    }

    //************************************************************************************
    addSensor(data) {
        var sensor = {
            'label' : data.attributes.friendly_name,
            'unit'  : data.attributes.unit_of_measurement,
            'value' : data.state,
            'history' : [
                this.historization(data)
            ]
        }

        return this.#data.push(sensor) - 1;
    }

    //************************************************************************************
    updateSensor(/* int */ id, /* object */ data) {

        this.#data[id].label = data.attributes.friendly_name;
        this.#data[id].unit = data.attributes.unit_of_measurement;
        this.#data[id].value = data.state;

        this.#data[id].history = this.updateHistory(this.#data[id].history, data);
    }

    //************************************************************************************
    updateHistory(/* array */ history, /* object */ data) {
        var entry = null;
        do {
            entry = history.shift();
            var t1 = new Date(this.deHistorization(entry));
        } while (86400000 /* 24h in milliseconds */ < Date() - t1);

        history.unshift(entry);
        history.push(this.historization(data));
        return history;
    } 

    //************************************************************************************
    getStatesOf(/* string */ deviceClass) {

        if (deviceClass in this.#index) {

            var devices = this.#index[deviceClass];

            var result = {
                deviceClass : deviceClass,
                states : Object.keys(devices).map( (key) => {
                    var ix = devices[key];
                    return {
                        label: this.#data[ix].label,
                        unit: this.#data[ix].unit,
                        value: this.#data[ix].value
                    };
                })
            };

            return result;

        } else {
            return null;
        }
    }

    //************************************************************************************
    firstDeviceClass() {
        var classes = Object.keys(this.#index);
        if (classes.length > 0) {
            return classes[0];
        } else {
            return null;
        }
    }

    //************************************************************************************
    nextDeviceClassAfter(/* string */ deviceClass) {
        var classes = Object.keys(this.#index);
        var nix = -1;
        if (-1 < (nix = classes.indexOf(deviceClass))) {
            nix = (classes.length <= (nix + 1)) ? 0 : nix + 1;
            return classes[nix];
        } else {
            return null;
        }
    }

};

module.exports = States;