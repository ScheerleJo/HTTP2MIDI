const midi = require('./midi');
const lib = require('./lib');

var origin = "";


//#region Functions for "Studio One Prime 5"
function startRec() {

    midi.sendMidiStudioOne(85);
}
function stopRec() {
    
    midi.sendMidiStudioOne(86);
}
function setMarker() {
    
    midi.sendMidiStudioOne(87);
}
function setSelection() {

    midi.sendMidiStudioOne(90);
}
function normalizeAudio() {

    midi.sendMidiStudioOne(88);
}
function exportAudio() {

    midi.sendMidiStudioOne(89);
    lib.checkAutoExport();
}
//#endregion

//#region Actions for "WorshipTools: Presenter"
function bindPresenter() {

    if(isPresenterBound) {
        lib.printDebugInfo('Presenter is already bound', 'error'); 
        return;
    }
    // Callable only when Presenter isn't bound
    lib.printDebugInfo('MidiOutput will be bound to Presenter', 'presenter');
    lib.callPresenterStartup();
}
function toFirstItem() {
    lib.printDebugInfo('Item Selection will be changed to first Item', 'presenter', origin);
    midi.sendMidiPresenter(0);
}
function previousItem() {
    lib.printDebugInfo('Prevoius Item will be executed', 'presenter', origin);
    midi.sendMidiPresenter(2);
}
function nextItem() {
    lib.printDebugInfo('Next Item will be executed', 'presenter', origin);
    midi.sendMidiPresenter(3);
}
function toFirstSlide() {
    lib.printDebugInfo('Slide Selection will be changed', 'presenter', origin);
    midi.sendMidiPresenter(4);
}
function previousSlide() {
    lib.printDebugInfo('Prevoius Slide will be executed', 'presenter', origin);
    midi.sendMidiPresenter(5);
}
function nextSlide() {
    lib.printDebugInfo('Next Slide will be executed', 'presenter', origin);
    midi.sendMidiPresenter(6);
}

//#endregion