const midiIO = require('easymidi');

class MidiOutput {
    constructor(config) {
        if(midiIO.getOutputs().includes(config.name)) {
            this.midiOutput = new midiIO.Output(config.name);
            console.log(`MIDI-Output ${config.name} is active`);
            this.active = true;
        } else this.active = false;
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
        if(midiIO.getInputs().includes(config.name) && config.active) {
            this.midiInput = new midiIO.Input(config.name);
            console.log(`MIDI-Input ${config.name} is active`);
            this.active = true;
        } else {
            console.error('No MIDI-Input active. Please check your configuration');
            this.active = false;
        }
    }

    closeMidiInput() {
        this.midiInput.close();
    }

    activateMidiListener(studioOne) {
        this.midiInput.on("start", () => studioOne.setRec(true));
        this.midiInput.on("stop", () => studioOne.setRec(false));
    }
}
module.exports = {MidiOutput, MidiInput}
