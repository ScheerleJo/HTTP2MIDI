// eslint-disable-next-line no-global-assign
DocumentType = module;

const midi = require('easymidi');



exports = {
    midiInActive,
    midiOutActive,

    instantiateMidiOutput,
    instantiateMidiInput,
    sendMidiStudioOne,
    sendMidiPresenter
}


var midiInput = null;
var midiInActive = false;

var midiOutput = null;
var midiOutActive = false;


function instantiateMidiInput(midiInName) {
    if (midiInActive == false) {
        return;
    }
    midiInput = new midi.Input(midiInName);
}


function instantiateMidiOutput(midiOutName) {
    if (midiOutActive == false) {
        return;
    }
    midiOutput = new midi.Output(midiOutName);
}





/**
 * Sending ControlChange Commands on MIDI-Channel 1
 * @param  {number} cc
 * Number of the midi CC-Command; 7-Bit Numbers
 */
function sendMidiStudioOne(cc){
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

/**
 * Sending NoteOn Commands on MIDI-Channel 2
 * @param  {number} note
 * Number of midi Note; 7-Bit Numbers 
 */
function sendMidiPresenter(note){
        midiOutput.send("noteon", {
            note: note,
            value: 127,
            channel: 2
        });
}
