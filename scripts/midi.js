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
        this.active = false;
    }

    /**
     * Sending ControlChange Commands (value 127, followed by value 0 after 200ms)
     * @param  {number} cc Number of the midi CC-Command; 7-Bit Numbers
     * @param  {number} channel easymidi channel (0-based): 1 = MIDI channel 2
     */
    sendMidiCC(cc, channel = 1) {
        if(!this.active) return;
        this.midiOutput.send("cc", {
            controller: cc,
            value: 127,
            channel: channel
        });
        setTimeout(() => {
            if(!this.active) return;
            this.midiOutput.send("cc", {
                controller: cc,
                value: 0,
                channel: channel
            });
        }, 200);
    }

    /**
     * Sending NoteOn Commands with velocity 127
     * @param  {number} note Number of midi Note; 7-Bit Numbers
     * @param  {number} channel easymidi channel (0-based): 2 = MIDI channel 3
     */
    sendMidiNoteOn(note, channel = 2) {
        if(!this.active) return;
        this.midiOutput.send("noteon", {
            note: note,
            velocity: 127,
            channel: channel
        });
    }
}

// Not yet functioning due to some weird behavior of Studio One, which is not sending any MIDI-Data
class MidiInput {
    constructor(config) {
        this.active = false;
        if(!config.active) {
            console.info('MIDI-Input is disabled in the configuration');
        } else if(midiIO.getInputs().includes(config.name)) {
            this.midiInput = new midiIO.Input(config.name);
            console.log(`MIDI-Input ${config.name} is active`);
            this.active = true;
        } else {
            console.error(`MIDI-Input ${config.name} not found. Please check your configuration`);
        }
    }

    closeMidiInput() {
        this.midiInput.close();
        this.active = false;
    }

    activateMidiListener(studioOne) {
        this.midiInput.on("start", () => studioOne.setRec(true));
        this.midiInput.on("stop", () => studioOne.setRec(false));
    }
}
module.exports = {MidiOutput, MidiInput}
