function matchTopic(/* string */ template, /* string */ topic){
//****************************************************************************************
    
        var templateExpression = template.split('/').map(t => {
            if (('#' == t) || ('+' == t)) {
                t = '.*';
            }
    
            return t;
        }).join('\/');

        console.debug(`${template} => ${topic}`);
    
        return null !== topic.match(templateExpression);
    
}

class Subscriber
{
    #topicPattern = '';

    constructor(pattern) {
        this.#topicPattern = pattern;
    }

    get pattern() {
        return this.#topicPattern;
    }
    
    isResponsible(/* string */ topic) {
        return matchTopic(this.#topicPattern, topic);        
    }

    handle(/* string */ topic, /* string */ message, /* object */ client) {
        return true;   
    }
}

module.exports = Subscriber;