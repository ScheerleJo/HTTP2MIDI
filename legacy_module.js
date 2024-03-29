// eslint-disable-next-line no-global-assign
DocumentType = module;

const midi = require('easymidi');
const url_parse = require('url-parse');
const execFile = require('child_process').execFile;
const find = require('find-process');
const config = require('config');
const PORT = config.get('server.port');
const VERSION = config.get('application.version');
var midiOutput;
var midiInput;

let activeStudioOne = false;
let deactivateMidi = false;
// let deactivateMidiInput = false;
let autoExport = false;
let bindPresenter = false;
let rec = false;
let marker = 0;
let latestAction = '';
let midiInName = '';
let midiOutName = '';

module.exports = {
    PORT,
    VERSION,
    loadConfig,
    printDebugInfo,
    handleAction,
    handleAHKCallback,
    handleCompanionFeedback,
    killMidiOutput,
    s1Active,
    activeStudioOne,
    s1StartUpState
}

// This is still temporary until I figure out something better xD
midiInName = config.get('midiInputConfig.name');
midiInput = new midi.Input(midiInName);

/**
 * Function to bind the MIDI-Input to Presenter.
 * Due to some bullshit, the MIDI-connection is sometimes lost, when you open Presenter.
 */
function callPresenterStartup() {
    execFile('./scripts/midi2presenter_startup.exe');  
}
/**
 * function to call the AutoExportScript.
 */
function callS1Export() {
    execFile('./scripts/midi2s1_export.exe');
}
/**
 * Load the Config file and parse the fetched information.
 * Handling Midi-Output and AutoExport.
 * Useful, when programming and testing!
 */
function loadConfig(){
    midiInName = config.get('midiInputConfig.name');
    midiOutName = config.get('midiOutputConfig.name');

    if(config.get('midiInputConfig.active') == false){
        // deactivateMidiInput = true;
        printDebugInfo('MIDI-Input is disabled. Check config/default.json to activate!', 'warning');
    } else {
        // deactivateMidiInput = false;
        // midiInput = new midi.Output(midiInName);
        printDebugInfo(`MIDI-Input is open and listening on: ${midiInName}` , 'info');
    }

    if(config.get('midiOutputConfig.active') == false){
        deactivateMidi = true;
        printDebugInfo('MIDI-Output is disabled. Check config/default.json to activate!', 'warning');
    } else {
        deactivateMidi = false;
        midiOutput = new midi.Output(midiOutName);
        printDebugInfo(`MIDI-Output is open on: ${midiOutName}` , 'info');
    }

    let exportState = 'AutoExport for StudioOne is';
    if(config.get('autoExport') == true){
        autoExport = true;
        printDebugInfo(`${exportState} ON`, 'info');
    } else {
        autoExport = false;
        printDebugInfo(`${exportState} OFF. Check config/default.json to activate!`, 'warning');
    }
}

/**
 * A function to print debugging info in different colors depending on the type of info
 * @param  {string} text 
 * text, which will be shown on the command prompt
 * @param  {string} state
 * selects the right color
 * @param  {string} origin
 * defines the origin of the info
 */
function printDebugInfo(text, state, origin){
    switch(state){
        case 's1': console.log('\x1b[34m', `${origin}2s1: ${text}`); break;                 // Blue
        case 'presenter': console.log('\x1b[32m', `${origin}2presenter: ${text}`); break;   // Green

        case 'info': console.log('\x1b[37m', `Info: ${text}`); break;                       // White
        case 'warning': console.log('\x1b[33m', `Warning: ${text}`); break;                 // Orange
        case 'error': console.log('\x1b[31m', `Error: ${text}`); break;                     // Red
        case 'debug': console.log('\x1b[35m', `Debug: ${text}`); break;                     // Purple
    }
}

function killMidiOutput(){
    if(deactivateMidi == false) { midiOutput.close(); }
}

async function s1Active(){
    var list = await find('name', 'Studio One');
    if(list.length > 0)  activeStudioOne = true;
    else activeStudioOne = false;
}

async function s1StartUpState(){
    await s1Active()
    printDebugInfo(`Studio One State: ${activeStudioOne}`, 'debug');
}
/**
 * Toggle the corresponding action to the input action in the querystring
 * @param  {object} url
 * Action of the Request
 * @param  {string} origin
 * Origin of the Request
 */
async function handleAction (url, origin){
    let returnMessage = '';
    let action = url_parse(url, true).query.action;
    switch (action){
        case 'startRec':
            if(!activeStudioOne){
                printDebugInfo('Studio One is not running!', 'error');
                break;
            }
            if(rec){
                printDebugInfo('There is currently an active recoring', 'warning');
                break;
            }
            printDebugInfo('Recording will be started', 's1', origin);
            sendMidiStudio(85);
            marker = 0;
            returnMessage = {rec};
            break;

        case 'stopRec': 
            if(!activeStudioOne){
                printDebugInfo('Studio One is not running!', 'error');
                break;
            }
            if(!rec){
                printDebugInfo('There is currently no active recoring', 'warning');
                break;
            }
            printDebugInfo('Recording will be stopped', 's1', origin);
            sendMidiStudio(86);
            returnMessage = {rec};
            break;

        case 'setMarker':
            if(!activeStudioOne){
                printDebugInfo('Studio One is not running!', 'error');
                break;
            }
            printDebugInfo('Marker will be set', 's1', origin);
            sendMidiStudio(87);
            marker++;
            returnMessage = {marker};
            break;
        case 'setEndMarker': 
            if(!activeStudioOne){
                printDebugInfo('Studio One is not running!', 'error');
                break;
            }
            if(rec){
                printDebugInfo('There is currently an active recoring', 'warning');
                break;
            }
            printDebugInfo('Markers will be set correctly to recording length', 's1', origin);
            sendMidiStudio(90);
            break;
        case 'normalize':
            if(!activeStudioOne){
                printDebugInfo('Studio One is not running!', 'error');
                break;
            }
            if(rec){
                printDebugInfo('There is currently an active recording', 'warning');
                break;
            }
            printDebugInfo('Normalizing Effect will be started', 's1', origin);
            sendMidiStudio(88);
            break;
        case 'exportAudio':
            if(!activeStudioOne){
                printDebugInfo('Studio One is not running!', 'error');
                break;
            }
            if(rec){
                printDebugInfo('There is currently an active recording', 'warning');
                break;
            }
            printDebugInfo('Exporting Process will be started', 's1', origin);
            sendMidiStudio(89);
            if(autoExport) callS1Export();
            break;
        
        case 'bindPresenter': 
            if(bindPresenter) {
                printDebugInfo('Presenter is already bound', 'error'); 
                break;   
            }
            // Callable only when Presenter isn't bound
            printDebugInfo('MidiOutput will be bound to Presenter', 'presenter');
            callPresenterStartup();
            break;
        case 'changeItem': 
            printDebugInfo('Item Selection will be changed', 'presenter', origin);
            sendMidiPresenter(0);
            break;
        case 'prevItem': 
            printDebugInfo('Prevoius Item will be executed', 'presenter', origin);
            sendMidiPresenter(2);
            break;
        case 'nextItem': 
            printDebugInfo('Next Item will be executed', 'presenter', origin);
            sendMidiPresenter(3);
            break;
        case 'changeSlide': 
            printDebugInfo('Slide Selection will be changed', 'presenter', origin);
            sendMidiPresenter(4);
            break;
        case 'prevSlide': 
            printDebugInfo('Prevoius Slide will be executed', 'presenter', origin);
            sendMidiPresenter(5);
            break;
        case 'nextSlide': 
            printDebugInfo('Next Slide will be executed', 'presenter', origin);
            sendMidiPresenter(6);
            break;
        
        case 'debugStartup': 
            printDebugInfo('The Localhost Debug-Helper has been accessed','debug');
            break;
        default: printDebugInfo('Action not detected! Error!', 'error'); break;
    }
    await s1Active();
    if(action != 'debugStartup') latestAction = action;
    if (origin == 'Debug') return returnJSONdata(); 
    else return returnMessage;
}
/**
 * This function implements a constant feedback for Companion to get the recording status and marker count
 * @param  {object} url
 * the URL that was triggered
 */
function handleCompanionFeedback(url) {
    //parses the url to contain only the querystring-part of 'feedback'
    let action = url_parse(url, true).query.feedback;
    let returnMessage = '';

    switch(action) {
        case 'recStatus':
            returnMessage = {rec};
            break;
        case 'markerCount':
            returnMessage = {marker};
            break;
        default:
            printDebugInfo('The requested feedback does not exist or can not be parsed!', 'error');
            returnMessage =  {};
            break;
    }
    return returnMessage;
}

function handleAHKCallback(url){
    let query = url_parse(url, true).query
    let state = (query.state === 'true')
    switch(query.program){
        case 's1':
            if(state == false){
                printDebugInfo('The AutoExport failed!', 'error');
                break;
            }
            printDebugInfo('The AutoExport was successful!', 's1', 'ahk');
            break;
        case 'presenter':
            if(state == false){
                printDebugInfo('Binding Midi to Presenter failed!', 'error');
                bindPresenter = false;
                break;
            }
            printDebugInfo('Binding to Presenter was successful!', 'presenter', 'ahk');
            bindPresenter = true;
            break;
    }
}
//#region Send/Recieve MIDI-Commands

//Get current status of Recording in Studio One
midiInput.on('start', () => rec = true)
midiInput.on('stop', () => rec = false)

/**
 * Sending ControlChange Commands on MIDI-Channel 1
 * @param  {number} cc
 * Number of the midi CC-Command; 7-Bit Numbers
 */
function sendMidiStudio(cc){
    if(deactivateMidi == false){
        midiOutput.send("cc", {
            controller: cc,
            value: 127,
            channel: 1
        });
        setTimeout(() => {
            midiOutput.send("cc", {
                controller: cc,
                velocity: 0,
                channel: 1
            })
        }, 200);
    }
}

/**
 * Sending NoteOn Commands on MIDI-Channel 2
 * @param  {number} note
 * Number of midi Note; 7-Bit Numbers 
 */
function sendMidiPresenter(note){
    if(deactivateMidi == false){
        midiOutput.send("noteon", {
            note: note,
            value: 127,
            channel: 2
        });
    }
}
//#endregion

/**
 * Return JSON-Data for handling frontend Logic and Config
 */
function returnJSONdata(){
    return { 
        'recStatus': rec, 
        'markerCount': marker, 
        'latestAction': latestAction, 
        'deactivateMidi': deactivateMidi, 
        'deactivateAutoExport': !autoExport, 
        'MidiOutput': midiOutName,
        'MidiInput': midiInName,

    };
}