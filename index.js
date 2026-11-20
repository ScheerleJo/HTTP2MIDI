const config = new (require('./scripts/config'))();
console.log(`HTTP2MIDI ${config.get('application:version')}`);
console.log('Webserver for communication between Companion and Studio One\nTrying to start the server...\n');

const feedback = require('./scripts/feedback');
const { StudioOneFunction, PresenterFunction, myClass } = require('./scripts/functions');
const midi = require('./scripts/midi');
const {swaggerUi, swaggerSpec} = require ('./config/swagger');
const express = require('express');
const app = express();

//#region Startup Things
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
let output = new midi.MidiOutput(config.get('midiOutputConfig'));
let input = new midi.MidiInput(config.get('midiInputConfig'));

const studioOne = new StudioOneFunction(output);
const presenter = new PresenterFunction(output);
const myFunctions = new myClass(output);      // Call your new function class here

let server = null;
let shuttingDown = false;

if(input.active) input.activateMidiListener(studioOne);
if(!output.active) { // Without a Midi-Output, the application is useless
    console.error('No MIDI-Output active. Please check your configuration');
    kill();
}

/**
 * Returns the query parameter as string, or undefined if it is missing or not a single value
 * @param {*} value value from req.query
 * @returns {string|undefined}
 */
function queryString(value) {
    return typeof value === 'string' ? value : undefined;
}

/**
 * Executes a whitelisted action of the given handler and sends the resulting status code
 * @param {object} handler instance of a function class
 * @param {string[]} allowedActions names of the methods that may be called
 * @param {*} status status that will be passed to the action
 */
function handleAction(req, res, handler, allowedActions, status) {
    const action = queryString(req.query.action);
    if(!action || !allowedActions.includes(action)) return res.sendStatus(404);
    const retVal = handler[action](status);
    res.sendStatus(req.query.src === 'companion' ? 200 : (retVal || 200));
}

/**
 * shuts down the Webserver gracefully
 */
app.get('/kill', (req, res) => {
    res.json({'status':'Shutdown'});
    kill();
});
/**
 * /studioOne?action=... is used to handle the requests from Companion for Studio One
 */
app.get('/studioOne', (req, res) => {
    handleAction(req, res, studioOne, StudioOneFunction.ACTIONS, feedback.getStudioOneStatus());
});
/**
 * /presenter?action=... is used to handle the requests from Companion for Presenter
 */
app.get('/presenter', (req, res) => {
    handleAction(req, res, presenter, PresenterFunction.ACTIONS, feedback.getPresenterStatus());
});
/**
 * /get is used to handle the status requests from Companion for constant updates
 */
app.get('/get', (req, res) => {
    const key = queryString(req.query.feedback);
    const functionName = key && Object.hasOwn(StudioOneFunction.FEEDBACK, key) ? StudioOneFunction.FEEDBACK[key] : undefined;
    if(!functionName) return res.sendStatus(404);
    res.send(studioOne[functionName]());
});


// branch for your custom functions
app.get('/myFunctions', (req, res) => {
    handleAction(req, res, myFunctions, myClass.ACTIONS);
});

/**
 * builds the Webserver
 */
if(output.active){
    server = app.listen(config.get('server:port'), () =>{
        console.log(`Server running on Port ${config.get('server:port')}\n`);
    });
}


function kill() {
    if(shuttingDown) return;
    shuttingDown = true;
    console.warn('Application will shut down');
    if(server) server.close();
    if(input.active) input.closeMidiInput();
    if(output.active) output.closeMidiOutput();
    if(!process.stdin.isTTY) process.exit();
    const rl = require('node:readline').createInterface({input: process.stdin, output: process.stdout});
    rl.question('\nServer will shutdown after pressing [Enter]...', () => {
        rl.close();
        process.exit();
    });
}
