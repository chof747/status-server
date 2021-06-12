const MESSAGE_FILE = `${process.env.DATADIR}/messages.json`;
const fs = require('fs');

class Messages {

    #index = {};
    #data = []
    alertLevel;
    alertLevelChange;


    static instance = null;

    //------------------------------------------------------------------------------------
    static read() {
        if (null === this.instance) {
            let rawdata = fs.readFileSync(MESSAGE_FILE);
            let jsondata = JSON.parse(rawdata);
            this.instance = new Messages(jsondata);
            console.log("reading"); 
        }

        return this.instance;
    }

    //------------------------------------------------------------------------------------
    write() {
        let jsonString = JSON.stringify(this.#data);
        fs.writeFileSync(MESSAGE_FILE, jsonString, err => {
            console.log('Error writing file', err);
        })
    }

    //------------------------------------------------------------------------------------
    constructor(/* Array */ data)
    {
        this.alertLevel = 999;
        this.alertLevelChange = false;
        this.#data = data
        this.sortAndRebuildIndex();
    }

    //------------------------------------------------------------------------------------
    sortAndRebuildIndex() {
        this.#data.sort(function(a,b) {

            if (a.level < b.level)      return -1;
            else if (a.level > b.level) return  1;
            else if (a.time < b.time) return -1;
            else if (a.time > b.time) return 1;
            else return 0;
        });

        this.#data.forEach((m, ix) => {
            this.#index[m.id] = ix;
        });
    }

    //------------------------------------------------------------------------------------
    setAlertLevel(message) {
        if (undefined === message.level) {
            message.level = 3;            
        } else  if (1 > message.level) {
            message.level = 1;
        } else if ( 3 < message.level) {
            message.level = 3;
        }

        if (this.alertLevel > message.level) {
            this.alertLevel = message.level
            console.debug(`alertLevel = ${this.alertLevel}`);
            this.alertLevelChange = true;
        }
        return message;
    }

    //------------------------------------------------------------------------------------
    getNewAlertLevel() {
        if (this.alertLevelChange) {
            this.alertLevelChange = false;
            return this.alertLevel;
        } else {
            return false;
        }
    }
    

    //------------------------------------------------------------------------------------
    add(/* string */ id, /* object */ message) {

        //add or overwrite the message id so that it is detectable
        message.id = id;
        message = this.setAlertLevel(message);

        if (this.hasMessage(id)) {
            this.#data[this.#index[id]] = message;
        } else {
            this.#data.push(message);
        }
        this.sortAndRebuildIndex();
        return true;
    }

    //------------------------------------------------------------------------------------
    delete(/* string */ id) {
        if (this.hasMessage(id)) {
            this.#data.splice(this.#index[id], 1);
            delete this.#index[id];

            this.sortAndRebuildIndex();
            return true;
        } else {
            return false;
        }
    }

    //------------------------------------------------------------------------------------
    hasMessage(/* string */ id) {
        return id in this.#index;
    }

    //------------------------------------------------------------------------------------
    scrollFrom(/* string */ id, /* boolean */ up) {

        up = (undefined === up) ? true : up;

        if (this.#data.length > 0) {
            var ix =this.#index[id] + ((up) ? 1 : -1);
            ix = (ix >= this.#data.length) ? 0 : ix;
            ix = (ix < 0) ? this.#data.length - 1 : ix;
            return this.#data[ix];
        } else {
            return null;
        }
    }

    //------------------------------------------------------------------------------------
    first() {
        if (this.#data.length > 0) {
            return this.#data[0];
        } else {
            return false;
        }
    }

}



module.exports = Messages;