const config = new (require('./scripts/config'))();
console.log(`HTTP2MIDI ${config.get('application:version')}`);
console.log('Webserver for communication between Companion and Studio One\nTrying to start the server...\n');

const feedback = require('./scripts/feedback');
const functions = require('./scripts/functions');
const midi = require('./scripts/midi');
const swagger = require ('./config/swagger');
const express = require('express');
const app = express();

//#region Startup Things
app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerSpec));

let output = new midi.MidiOutput(config.get('midiOutputConfig'));
if(!config.get('midiOutputConfig').active) { // Without a Midi-Output, the application is useless
    console.error('No MIDI-Output selected. Please check your configuration');
    kill();
}

const studioOne =  new functions.StudioOneFunction(output);
const presenter = new functions.PresenterFunction(output);
const myFunctions = new functions.myClass(output);      // Call your new function class here

let input = new midi.MidiInput(config.get('midiInputConfig'));
if(config.get('midiInputConfig').active) input.activateMidiListener(studioOne);


/**
 * shuts down the Webserver gracefully
 */
app.get('/kill', (req, res) => {
    res.json({'status':'Shutdown'});
    kill()
});
/**
 * /studioOne?action=... is used to handle the requests from Companion for Studio One
 */
app.get('/studioOne', (req, res) => {
    if(studioOne[req.query.action]) {
        let retVal = studioOne[req.query.action](feedback.getStudioOneStatus());
        res.sendStatus(req.query.src == 'companion' ? 200 : retVal); 
    } else res.sendStatus(404);
});
/**
 * /presenter?action=... is used to handle the requests from Companion for Presenter
 */
app.get('/presenter', (req, res) => {
    if(presenter[req.query.action]) {
        let retVal = presenter[req.query.action](feedback.getPresenterStatus());
        res.sendStatus(req.query.src == 'companion' ? 200 : retVal); 
    } else res.sendStatus(404);
});
/**
 * /get is used to handle the status requests from Companion for constant updates
 */
app.get('/get', (req, res) => {
    let functionName = 'sendCompanion' + req.query.feedback.charAt(0).toUpperCase() + req.query.feedback.slice(1);
    res.send(studioOne[functionName]());
}); 


// branch for your custom functions
app.get('/myFunctions', (req, res) => {
    if(myFunctions[req.query.action]) {
        res.json(myFunctions[req.query.action]);
    } else res.sendStatus(404);
});

/**
 * builds the Webserver
 */
app.listen(config.get('server:port'), () =>{        
    console.log(`Server running on Port ${config.get('server:port')}\n`);
});


function kill() {
    console.warn('Application will shut down');
    if(input || false) input.closeMidiInput();
    output.closeMidiOutput();
    this.process.exit();
}