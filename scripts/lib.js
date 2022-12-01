const execFile = require('child_process').execFile;
const config = require('config');
const PORT = config.get('server.port');
const VERSION = config.get('application.version');


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