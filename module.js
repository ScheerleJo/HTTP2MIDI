const midi = require('easymidi');
const url_parse = require('url-parse');
const path = require('path');
const fs = require('fs');

let midiOutput;
let deactivateMidi = false;
let rec = false;
let marker = 0;
let latestAction = '';

DocumentType= module;

module.exports = {
    deactivateMidiAction,
    printDebugInfo,
    startMidiOutput,
    handleAction,
    killMidiOutput,
    debugPath,
    writeToJSONfile,
    resetJSONobject,
    returnJSONdata
}

/**
 * function to deactivate the MIDI-Output sequence.
 * Useful, when programming and not having a MIDI-Controller
 * @param  {boolean} state
 */
function deactivateMidiAction(state){
    if(state== true){
        deactivateMidi = true;
    }
    else {
        deactivateMidi = false;
    }
}

/**
 * A function to print debugging info in different colors depending on the type of info
 * @param  {string} text 
 * the printed text, which will be shown on the command prompt
 * @param  {string} state
 * the parameter to select the right color
 * @param  {string} origin
 * the parameter to define the origin of the info
 */
function printDebugInfo(text, state, origin){
    switch(state){
        case 's1': console.log('\x1b[34m', `${origin}2s1: ${text}`); break;
        case 'presenter': console.log('\x1b[32m', `${origin}2presenter: ${text}`); break;
        case 'info': console.log('\x1b[37m', `Info: ${text}`); break;
        case 'warning': console.log('\x1b[33m', `Warning: ${text}`); break;
        case 'error': console.log('\x1b[37m', `Error: ${text}`); break;
    }
}

function startMidiOutput(){
    if(deactivateMidi == false){
        midiOutput = new midi.Output('QUAD-CAPTURE');
    }
}
function killMidiOutput(){
    if(deactivateMidi == false) {
        midiOutput.close();
    }
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
            if(rec == false){
                printDebugInfo('Recording will be started', 's1', origin); 
                sendMidiStudio(85);
                rec = true;
                marker = 0;
                ret = {rec};
            } else { printDebugInfo('There is currently an active recoring', 'warning', 'Warning'); }
            break;
        case 'stopRec': 
            if(rec == true){
                printDebugInfo('Recording will be stopped', 's1', origin);
                sendMidiStudio(86);
                rec = false;
                ret = {rec};
            } else { printDebugInfo('There is no active recoring that can be stopped', 'warning', 'Warning'); }
            break;
        case 'setMarker':
            if(rec == true){
                printDebugInfo('Marker will be set', 's1', origin);
                sendMidiStudio(87);
                marker++;
                ret = {marker};
            } else { printDebugInfo('There is currently no active recording', 'warning', 'Warning'); }
            break;
            case 'setEndMarker': 
            if(rec == false){
                printDebugInfo('Markers will be set correctly to recording length', 's1', origin);
                sendMidiStudio(90);
            } else { printDebugInfo('There is currently an active recording', 'warning', 'Warning'); }
            break;
        case 'normalize':
            if(rec == false){
                printDebugInfo('Normalizing Effect will be started', 's1', origin);
                sendMidiStudio(88);
            } else { printDebugInfo('There is currently an active recording', 'warning', 'Warning'); }
            break;
        case 'exportAudio':
            if(rec == false) {
                printDebugInfo('Exporting Process will be started', 's1', origin);
                sendMidiStudio(89);
            } else { printDebugInfo('There is currently an active recording', 'warning', 'Warning'); }
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
        default: printDebugInfo('Action not detected! Error!', 'error', 'local'); break;     
    }
    latestAction = action;
    writeToJSONfile();
    return ret;
}

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

function debugPath(){
    return path.join(__dirname + '/views/debug-helper.html');
}

/**
 * Return JSON-Data for handling frontend Logic
 * @param  {string} action
 * latestAction parameter 
 */
function returnJSONdata(){
    return { 'recStatus': rec, 'markerCount': marker, 'latestAction': latestAction };
}

function resetJSONobject(){
    rec = false;
    marker = 0;
    latestAction = 0;
    writeToJSONfile();
}

/**
 * Write the JSON-Object from the 'returnJSONdata' method to the 'latestInfo.json' file.
 */
function writeToJSONfile(){
    var jsonContent = JSON.stringify(returnJSONdata());
    fs.writeFile("./views/latestInfo.json", jsonContent, 'utf8', (err) => {
        if (err) { printDebugInfo(`An error occured while writing JSON Object to File.\n${err}`, '', 'Error!'); }
    });
}