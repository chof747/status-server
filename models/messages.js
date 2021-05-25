const MESSAGE_FILE = `${process.env.DATADIR}/messages.json`;
const fs = require('fs');

class Messages {

    #index = {};
    #data = []

    static read() {
        let rawdata = fs.readFileSync(MESSAGE_FILE);
        let jsondata = JSON.parse(rawdata);
        return new Messages(jsondata);
    }

    write() {
        let jsonString = JSON.stringify(this.#data);
        fs.writeFileSync(MESSAGE_FILE, jsonString, err => {
            console.log('Error writing file', err);
        })
    }

    constructor(/* Array */ data)
    {
        this.#data = data
        this.sortAndRebuildIndex();
    }

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

    add(/* string */ id, /* object */ message) {
        if (this.hasMessage(id)) {
            this.#data[this.#index[id]] = message;
        } else {
            this.#data.push(message);
        }
        this.sortAndRebuildIndex();
    }

    hasMessage(/* string */ id) {
        return id in this.#index;
    }

    next(/* string */ id) {
        var ix =this.#index[id] + 1;
        ix = (ix >= this.#data.length) ? 0 : ix;
        return this.#data[ix];
    }
}



module.exports = Messages;