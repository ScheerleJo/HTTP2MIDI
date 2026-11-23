const fs = require('node:fs');
const path = require('node:path');
const util = require('node:util');

/**
 * Mirrors all console output into logs/http2midi.log (with timestamps).
 * Needed for the tray mode, where the application runs without a console window.
 * The log of the previous run is kept as http2midi.old.log.
 * @param {string} baseDir folder in which the logs folder will be created
 * @returns {string} path of the log file
 */
function initLogger(baseDir) {
    const logDir = path.join(baseDir, 'logs');
    const logFile = path.join(logDir, 'http2midi.log');
    let fd = null;
    try {
        fs.mkdirSync(logDir, { recursive: true });
        if(fs.existsSync(logFile)) fs.renameSync(logFile, path.join(logDir, 'http2midi.old.log'));
        // synchronous writes, so nothing gets lost when the process exits directly afterwards
        fd = fs.openSync(logFile, 'a');
    } catch (err) {
        console.error(`Log file could not be created: ${err.message}`);
        return null;
    }

    for(const level of ['log', 'info', 'warn', 'error']) {
        const original = console[level].bind(console);
        console[level] = (...args) => {
            original(...args);
            const time = new Date().toLocaleString('de-DE');
            const tag = level === 'log' ? 'info' : level;
            const text = util.format(...args).replace(/\n+$/, '');
            try {
                fs.writeSync(fd, `[${time}] ${tag.toUpperCase().padEnd(5)} ${text}\n`);
            } catch {
                // logging must never crash the application
            }
        };
    }
    return logFile;
}

module.exports = { initLogger };
