const midiIO = require('easymidi');

class MidiOutput {
    constructor() {
        this.config = new (require('./config'))();
        this.midiOutConfig = this.config.get('midiOutputConfig');
        if (this.midiOutConfig.active){ 
            this.midiOutput = new midiIO.Output(this.midiOutConfig.name);
        } 
        return this;
    }

    closeMidiOutput() {
        this.midiOutput.close();
    }

    /**
     * Sending ControlChange Commands on MIDI-Channel 1
     * @param  {number} cc
     * Number of the midi CC-Command; 7-Bit Numbers
     */
    sendMidiStudioOne(cc) {
        this.midiOutput.send("cc", {
            controller: cc,
            value: 127,
            channel: 1
        });
        setTimeout(() => {
            this.midiOutput.send("cc", {
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
    sendMidiPresenter(note) {
        this.midiOutput.send("noteon", {
            note: note,
            value: 127,
            channel: 2
        });
    }
}

class MidiInput {
    constructor() {
        this.config = new (require('./config'))();
        this.midiInConfig = this.config.get('midiInputConfig');
        if (this.midiInConfig.active) {
            this.midiInput = new midiIO.Input(this.midiInConfig.name);
        }
        return this;
    }

    closeMidiInput() {
        this.midiInput.close();
    }

    activateMidiListener() {
        this.midiInput.on('sysex', (msg) => {
            console.log(msg);
        });
        this.midiInput.on('clock', (msg) => {
            console.log(msg);
        });
    }
}

module.exports = {MidiOutput, MidiInput}
