const midiIO = require('easymidi');

class MidiOutput {
    constructor(config) {
        this.midiOutput = new midiIO.Output(config.name);
        console.log(`MIDI-Output ${config.name} is active`);
    }

    closeMidiOutput() {
        this.midiOutput.close();
    }

    /**
     * Sending ControlChange Commands on MIDI-Channel 1
     * @param  {number} cc
     * Number of the midi CC-Command; 7-Bit Numbers
     */
    sendMidiCC(cc, channel = 1) {
        this.midiOutput.send("cc", {
            controller: cc,
            value: 127,
            channel: channel
        });
        setTimeout(() => {
            this.midiOutput.send("cc", {
                controller: cc,
                velocity: 0,
                channel: channel
            })
        }, 200);
    }

    /**
     * Sending NoteOn Commands on MIDI-Channel 2
     * @param  {number} note
     * Number of midi Note; 7-Bit Numbers 
     */
    sendMidiNoteOn(note, channel = 2) {
        this.midiOutput.send("noteon", {
            note: note,
            value: 127,
            channel: channel
        });
    }
}

// Not yet functioning due to some weird behavior of Studio One, which is not sending any MIDI-Data
class MidiInput {
    constructor(config) {
        if (config.active) {
            this.midiInput = new midiIO.Input(config.name);
            console.log(`MIDI-Input ${config.name} is active`);
        } else {
            console.log('No MIDI-Input selected. Please check your configuration');
        }
    }

    closeMidiInput() {
        this.midiInput.close();
    }

    activateMidiListener() {
        // Currently not working due to some weird behavior of Studio One and just trying to get some data out of the midi-Input
        this.midiInput.on('sysex', (msg) => {
            console.log(msg);
        });
        this.midiInput.on('clock', (msg) => {
            console.log(msg);
        });
    }
}

module.exports = {MidiOutput, MidiInput}
