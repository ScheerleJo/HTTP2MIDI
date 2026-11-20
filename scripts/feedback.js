const find = require('find-process').default;

module.exports = { getPresenterStatus, getStudioOneStatus };

let activeStudioOne = false;
let activePresenter = false;

/**
 * Waits for a given time
 * @param {number} ms Time in milliseconds to wait
 * @returns {Promise} Resolves after the given time
 * @example
 * timeout(1000); // waits for 1 second
 */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks every second if Studio One and Presenter are running and sets the status variables accordingly.
 * Uses a single process lookup for both applications. If the lookup fails, the last known status is kept.
 */
async function constantProcessStatus() {
    while(true) {
        try {
            const list = await find('name', /Studio One|Presenter/);
            const names = list.map(p => p.cmd || p.name || '');
            activeStudioOne = names.some(n => n.includes('Studio One'));
            activePresenter = names.some(n => n.includes('Presenter'));
        } catch (err) {
            console.warn(`Warning: Process status could not be determined: ${err.message}`);
        }
        await timeout(1000);
    }
}

/**
 * @returns {boolean} status of the Presenter
 */
function getPresenterStatus() {
    return activePresenter;
}

/**
 * @returns {boolean} status of Studio One
 */
function getStudioOneStatus() {
    return activeStudioOne;
}

constantProcessStatus();