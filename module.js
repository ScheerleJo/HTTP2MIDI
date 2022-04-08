const url_parse = require('url-parse');
const midi = require('easymidi');
let deactivateMidi = false;

DocumentType= module;

module.exports = {
    deactivateMidiAction,
    printDebugInfo,
    startMidiOutput,
    handleHttpAction,
    killMidiOutput
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
};
/**
 * A function to print debugging info in different colors depending on the type of info
 * @param  {string} text 
 * the printed text, which will be shown on the command prompt
 * @param  {string} state
 * the parameter to select the right color
 */
function printDebugInfo(text, state){
    switch(state){
        case 's1': console.log('\x1b[34m', `http2s1: ${text}`); break;
        case 'presenter': console.log('\x1b[32m', `http2presenter: ${text}`); break;
        case 'info': console.log('\x1b[37m', `Info: ${text}`); break;
        default: 
            console.log('\x1b[31m', `Èrror: Command not found!:`);
            console.log('\x1b[37m', text);
            break;
    }
}

function startMidiOutput(){
    if(deactivateMidi == false){
        let midiOutput = new midi.Output('QUAD-CAPTURE');
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
 * URL of the HTTP GET-Request
 */
function handleHttpAction (url){
    let action = url_parse(url, true).query.action;
    switch (action){
        case 'startRec': 
            printDebugInfo('Recording will be started', 's1'); 
            sendMidiStudio(85);
            break;
        case 'stopRec': 
            printDebugInfo('Recording will be stopped', 's1');
            sendMidiStudio(86);
            break;
        case 'setMarker':
            printDebugInfo('Marker will be set', 's1');
            sendMidiStudio(87);
            break;
	    case 'setEndMarker': 
            printDebugInfo('Markers will be set correctly to recording length', 's1');
            sendMidiStudio(90);
            break;
        case 'normalize':
            printDebugInfo('Normalizing Effect will be started', 's1');
            sendMidiStudio(88);
            break;
        case 'exportAudio': 
            printDebugInfo('Exporting Process will be started', 's1');
            sendMidiStudio(89);
            break;
        case 'changeItem': 
            printDebugInfo('Item Selection will be changed', 'presenter');
            sendMidiPresenter(0);
            break;
        case 'prevItem': 
            printDebugInfo('Prevoius Item will be executed', 'presenter');
            sendMidiPresenter(2);
            break;
        case 'nextItem': 
            printDebugInfo('Next Item will be executed', 'presenter');
            sendMidiPresenter(3);
            break;
        case 'changeSlide': 
            printDebugInfo('Slide Selection will be changed', 'presenter');
            sendMidiPresenter(4);
            break;
        case 'prevSlide': 
            printDebugInfo('Prevoius Slide will be executed', 'presenter');
            sendMidiPresenter(5);
            break;
        case 'nextSlide': 
            printDebugInfo('Next Slide will be executed', 'presenter');
            sendMidiPresenter(6);
            break;
        default: console.log('Action not detected! Error!'); break;     
    }
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