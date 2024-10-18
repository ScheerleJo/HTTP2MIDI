const find = require('find-process');

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
 * Checks if the Presenter is running and sets the activePresenter variable accordingly
 */
async function constantPresenterStatus() {
    // eslint-disable-next-line no-constant-condition
    while(true) {
        var list = await find('name', 'Presenter');
        if(list.length > 0)  activePresenter = true;
        else activePresenter = false;
        await timeout(1000);
    }
}

/**
 * Checks if Studio One is running and sets the activeStudioOne variable accordingly
 */
async function constantStudioOneStatus() {
    // eslint-disable-next-line no-constant-condition
    while(true) {
        var list = await find('name', 'Studio One');
        if(list.length > 0)  activeStudioOne = true;
        else activeStudioOne = false;
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

constantStudioOneStatus();
constantPresenterStatus();