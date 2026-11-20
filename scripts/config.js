const fs = require('node:fs');
const path = require('node:path');

/**
 * Folder that contains the user's config folder:
 * - compiled (pkg): the folder of http2midi.exe
 * - from source: the project root
 * That way the application works regardless of the current working directory.
 */
const BASE_DIR = process.pkg ? path.dirname(process.execPath) : path.join(__dirname, '..');
const CONFIG_FILE = path.join(BASE_DIR, 'config', 'server_config.json');
/** Default config shipped with the application (inside the exe when compiled) */
const DEFAULT_CONFIG_FILE = path.join(__dirname, '..', 'config', 'server_config.json');

/**
 * Creates config/server_config.json from the shipped default, if it does not exist yet
 */
function ensureConfigFile() {
    if(fs.existsSync(CONFIG_FILE)) return;
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    fs.writeFileSync(CONFIG_FILE, fs.readFileSync(DEFAULT_CONFIG_FILE));
    console.info(`No configuration found. A default configuration has been created at ${CONFIG_FILE}`);
}

class Config {
    constructor() {
        ensureConfigFile();
        this.nconf = require('nconf');
        this.nconf.argv().env().file({ file: CONFIG_FILE });
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
