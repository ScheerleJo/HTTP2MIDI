const midi = require('./midi');
const lib = require('./lib');

class StudioOneFunction {
    constructor() {}

    startRec() {
    
        midi.sendMidiStudioOne(85);
    }
    stopRec() {
        
        midi.sendMidiStudioOne(86);
    }
    setMarker() {
        
        midi.sendMidiStudioOne(87);
    }
    setSelection() {
    
        midi.sendMidiStudioOne(90);
    }
    normalizeAudio() {
    
        midi.sendMidiStudioOne(88);
    }
    exportAudio() {
    
        midi.sendMidiStudioOne(89);
        lib.checkAutoExport();
    }
}

class PresenterFunction {
    constructor() {
        this.isPresenterBound = false;
    }
    bindPresenter() {
    
        if(this.isPresenterBound) {
            lib.printDebugInfo('Presenter is already bound', 'error'); 
            return;
        }
        // Callable only when Presenter isn't bound
        lib.printDebugInfo('MidiOutput will be bound to Presenter', 'presenter');
        lib.callPresenterStartup();
    }
    toFirstItem() {
        lib.printDebugInfo('Item Selection will be changed to first Item', 'presenter');
        midi.sendMidiPresenter(0);
    }
    previousItem() {
        lib.printDebugInfo('Prevoius Item will be executed', 'presenter');
        midi.sendMidiPresenter(2);
    }
    nextItem() {
        lib.printDebugInfo('Next Item will be executed', 'presenter');
        midi.sendMidiPresenter(3);
    }
    toFirstSlide() {
        lib.printDebugInfo('Slide Selection will be changed', 'presenter');
        midi.sendMidiPresenter(4);
    }
    previousSlide() {
        lib.printDebugInfo('Prevoius Slide will be executed', 'presenter');
        midi.sendMidiPresenter(5);
    }
    nextSlide() {
        lib.printDebugInfo('Next Slide will be executed', 'presenter');
        midi.sendMidiPresenter(6);
    }
}

module.exports = { StudioOneFunction, PresenterFunction };

//#endregion