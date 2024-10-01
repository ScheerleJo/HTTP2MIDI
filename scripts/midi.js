const midiIO = require('easymidi');

class MidiOutput {
    constructor() {
        this.nconf = require('nconf');
        this.nconf.argv().env().file({ file: '../server_config.json' });
        this.midiOutConfig = this.nconf.get('midiOutputConfig');
    }

    instantiateMidiOutput() {
        if (!this.midiOutConfig.active) return;
        this.midiOutput = new midiIO.Output(this.midiOutConfig.name);
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
        this.nconf = require('nconf');
        this.nconf.argv().env().file({ file: '../server_config.json' });
        this.midiInConfig = this.nconf.get('midiInputConfig');
    }

    instantiateMidiInput() {
        if (!this.midiInConfig.active) return;
        this.midiInput = new midiIO.Input(this.midiInConfig.name);
    }
    closeMidiInput() {
        this.midiInput.close();
    }
}

exports = {MidiOutput, MidiInput}