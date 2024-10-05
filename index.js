const config = new (require('./scripts/config'))();
const feedback = require('./scripts/feedback');

console.log(`HTTP2MIDI ${config.get('application:version')}`);
console.log('Webserver for communication between Companion and Studio One\nTrying to start the server...\n');

const functions = require('./scripts/functions');
const midi = require('./scripts/midi');
const swagger = require ('./config/swagger');
const express = require('express');
const app = express();
//#region Startup Things

app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.swaggerSpec));


// Load the Midi-config and start Midi-Ports
let input = new midi.MidiInput();
let output = new midi.MidiOutput();
const studioOne = new functions.StudioOneFunction(output);
const presenter = new functions.PresenterFunction(output); 
// console.debug(`Debug: Midi-Input: ${input.midiInput.name}`);
// console.debug(`Debug: Midi-Output: ${output.midiOutput.name}`);
//#endregion


//#region RequestHandlers
app.get('/', (req, res) =>{
    res.send('HTTP2MIDI is running');
});

/**
 * shuts down the Webserver gracefully
 */
app.get('/kill', (req, res) => {
    res.json({'status':'Shutdown'});
    console.warn('Application will shut down');
    if(input) input.closeMidiInput();
    if(output) output.closeMidiOutput();
    this.process.exit();
});

/**
 * /studioOne?action=... is used to handle the requests from Companion for Studio One
 */
app.get('/studioOne', (req, res) => {
    let retVal = studioOne[req.query.action](feedback.getStudioOneStatus());
    res.sendStatus(req.query.src == 'companion' ? 200 : retVal); 
});
/**
 * /presenter?action=... is used to handle the requests from Companion for Presenter
 */
app.get('/presenter', (req, res) => {
    let retVal = presenter[req.query.action](feedback.getPresenterStatus());
    res.sendStatus(req.query.src == 'companion' ? 200 : retVal); 
});
/**
 * /get is used to handle the status requests from Companion for constant updates
 */
app.get('/get', (req, res) => {
    res.json(studioOne["sendCompanion" + (req.query.feedback).charAt(0).toUpperCase()]);
});

/**
 * builds the Webserver
 */
app.listen(config.get('server:port'), () =>{        
    console.log(`Server running on Port ${config.get('server:port')}`);
});
//#endregion




