// eslint-disable-next-line no-global-assign
DocumentType = module;

const midi = require('easymidi');
const url_parse = require('url-parse');
const exec = require('child_process').execFile;
const config = require('config');
const PORT = config.get('server.port');
var midiOutput;

let deactivateMidi = false;
let autoExport = false;
let bindPresenter = false;
let rec = false;
let marker = 0;
let latestAction = '';
let midiName = '';

module.exports = {
    PORT,
    loadConfig,
    printDebugInfo,
    handleAction,
    handleCallback,
    killMidiOutput
}

/**
 * Function to bind the MIDI-Input to Presenter.
 * Due to some bullshit, the MIDI-connection is lost every single time, when you open Presenter.
 */
function callPresenterStartup() {
    exec('./scripts/midi2presenter_startup.exe');  
}
/**
 * function to call the AutoExportScript.
 */
function callS1Export() {
    exec('./scripts/midi2s1_export.exe');
}
/**
 * Load the Config file and parse the fetched information.
 * Handling Midi-Output and AutoExport.
 * Useful, when programming and testing!
 */
function loadConfig(){
    midiName = config.get('midiConfig.name');
    if(config.get('midiConfig.active') == false){
        deactivateMidi = true;
        printDebugInfo('MIDI-Output is disabled. Check config/default.json to activate!', 'warning');
    } else {
        deactivateMidi = false;
        midiOutput = new midi.Output(config.get('midiConfig.name'));
        printDebugInfo(`MIDI-Output is open on: ${midiName}` , 'info');
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

/**
 * Toggle the corresponding action to the input action in the querystring
 * @param  {object} url
 * Action of the Request
 * @param  {string} origin
 * Origin of the Request
 */
function handleAction (url, origin){
    let ret = '';
    let action = url_parse(url, true).query.action;
    switch (action){
        case 'startRec':
            if(!rec){
                printDebugInfo('Recording will be started', 's1', origin);
                sendMidiStudio(85);
                rec = true;
                marker = 0;
                ret = {rec};
            } else { printDebugInfo('There is currently an active recoring', 'warning'); }
            break;
        case 'stopRec': 
            if(rec){
                printDebugInfo('Recording will be stopped', 's1', origin);
                sendMidiStudio(86);
                rec = false;
                ret = {rec};
            } else { printDebugInfo('There is no active recoring that can be stopped', 'warning'); }
            break;
        case 'setMarker':
            printDebugInfo('Marker will be set', 's1', origin);
            sendMidiStudio(87);
            marker++;
            ret = {marker};
            break;
        case 'setEndMarker': 
            if(!rec){
                printDebugInfo('Markers will be set correctly to recording length', 's1', origin);
                sendMidiStudio(90);
            } else { printDebugInfo('There is currently an active recording', 'warning'); }
            break;
        case 'normalize':
            if(!rec){
                printDebugInfo('Normalizing Effect will be started', 's1', origin);
                sendMidiStudio(88);
            } else { printDebugInfo('There is currently an active recording', 'warning'); }
            break;
        case 'exportAudio':
            if(!rec) {
                printDebugInfo('Exporting Process will be started', 's1', origin);
                sendMidiStudio(89);
                if(autoExport) callS1Export();
            } else { printDebugInfo('There is currently an active recording', 'warning'); }
            break;
        
        case 'bindPresenter': 
            if(!bindPresenter){     // Callable only once while runtime
                printDebugInfo('MidiOutput will be bound to Presenter', 'presenter');
                callPresenterStartup();
            } else { printDebugInfo('Presenter is already bound', 'error'); }
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
    if(action != 'debugStartup') latestAction = action;
    if (origin == 'Debug') return returnJSONdata(); 
    else return ret;
}


function handleCallback(url){
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
//#region Send MIDI-Commands

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
        'MidiOutput': midiName
    };
}