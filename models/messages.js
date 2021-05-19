
class Messages {

    #index = {};
    #data = []

    constructor(/* Array */ data)
    {
        this.#data = data
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

        console.log(this.#index);
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