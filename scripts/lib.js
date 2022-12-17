const execFile = require('child_process').execFile;
const config = require('config');
const PORT = config.get('server.port');
const VERSION = config.get('application.version');
const midi = require('./midi');


async function loadStartupConfig() {

    await checkAutoExport();

    await startupInput();

    await startupOutput();
}
/**
 * Function to bind the MIDI-Input to Presenter.
 * Due to some bullshit, the MIDI-connection is sometimes lost, when you open Presenter.
 */
function callPresenterStartup() {
    execFile('./scripts/autohotkey/midi2presenter_startup.ahk');  
}
/**
 * This function executes an autoExport feature that I wrote for Studio One. It dumps the exported files in a folderpath "C:/AktuellerGodi"
 */
function callS1Export() {
    execFile('./scripts/autohotkey/midi2s1_export.ahk');
}

async function startupInput() {
    let inputConfig = config.get('MidiInputConfig');
    //set bool wether the input is enabled or disabled in the midi.js file to be able to activate the Input
    midi.midiInActive = config.get(inputConfig.active);
    await midi.instantiateMidiInput(config.get(inputConfig.name));
    
}
async function startupOutput() {
    let outputConfig = config.get('MidiOutputConfig');
    //set bool wether the input is enabled or disabled in the midi.js file to be able to activate the Input
    midi.midiOutActive = config.get(outputConfig.active);
    await midi.instantiateMidiOutput(config.get(outputConfig.name));
}