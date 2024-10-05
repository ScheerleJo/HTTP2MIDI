class Config {
    constructor() {
        this.nconf = require('nconf');
        this.nconf.argv().env().file({ file: './config/server_config.json' });
    }
    getMidiOutputConfig() {
        return this.nconf.get('midiOutputConfig');
    }
    getMidiInputConfig() {
        return this.nconf.get('midiInputConfig');
    }
    get(key) {
        return this.nconf.get(key);
    }
}
module.exports = Config;