class PresenterFunction {
    constructor(midiOutput) {
        this.midiOut = midiOutput;
    }
    /**
     *  @swagger
     *  /presenter?action=toFirstItem:
     *  get:
     *      tags: ["Presenter"]
     *      summary: "Change Item Selection in Presenter to first Item"
     *      description: "Sends a Midi-Note to Presenter to change the Item Selection to the first Item"
     *      responses:
     *          200:
     *              description: Item Selection has been changed
     *          404:
     *              description: Error, because Presenter isn't running
     *  @param {boolean} status status of Presenter
     *  @returns {number} 200 - Item Selection has been changed, 404 - Error, because Presenter isn't running
     */
    toFirstItem(status) {
        if(this.checkPresenter('toFirstItem', status)) {
            console.info('Presenter: Item Selection will be changed to first Item');
            this.midiOut.sendMidiPresenter(0);
            return 200;
        }
        return 404;        
    }
    
    /**
     *  @swagger
     *  /presenter?action=previousItem:
     *  get:
     *      tags: ["Presenter"]
     *      summary: "Select Previous Item"
     *      description: "Sends a Midi-Note to Presenter to select the previous Item"
     *      responses:
     *          200:
     *              description: Previous item has been selected
     *          404:
     *              description: Error, because Presenter isn't running
     *  @param {boolean} status status of Presenter
     *  @returns {number} 200 - Previous item has been selected, 404 - Error, because Presenter isn't running
     */
    previousItem(status) {
        if(this.checkPresenter('previousItem', status)) {
            console.info('Presenter: Prevoius Item will be executed');
            this.midiOut.sendMidiPresenter(2);
            return 200;
        }
        return 404;  
    }

    /**
     *  @swagger
     *  /presenter?action=nextItem:
     *  get:
     *      tags: ["Presenter"]
     *      summary: "select next Item"
     *      description: "Sends a Midi-Note to Presenter to select the next Item"
     *      responses:
     *          200:
     *              description: Next item has been selected
     *          404:
     *              description: Error, because Presenter isn't running
     *  @param {boolean} status status of Presenter
     *  @returns {number} 200 - Next item has been selected, 404 - Error, because Presenter isn't running
     */
    nextItem(status) {
        if(this.checkPresenter('nextItem', status)) {
            console.info('Presenter: Next Item will be executed');
            this.midiOut.sendMidiPresenter(3);
            return 200;
        }
        return 404;  
    }

    /**
     *  @swagger
     *  /presenter?action=toFirstSlide:
     *  get:
     *      tags: ["Presenter"]
     *      summary: "Change to first Slide in the active Item"
     *      description: "Sends a Midi-Note to Presenter to change to Slide Selection in Presenter to the first Slide in the active Item"
     *      responses:
     *          200:
     *              description: Slide Selection has been changed
     *          404:
     *              description: Error, because Presenter isn't running
     *  @param {boolean} status status of Presenter
     *  @returns {number} 200 - Slide Selection has been changed, 404 - Error, because Presenter isn't running
     */
    toFirstSlide(status) {
        if(this.checkPresenter('toFirstSlide', status)) {
            console.info('Presenter: Slide Selection will be changed');
            this.midiOut.sendMidiPresenter(4);
            return 200;
        }
        return 404; 
    }

    /**
     *  @swagger
     *  /presenter?action=previousSlide:
     *  get:
     *      tags: ["Presenter"]
     *      summary: "Change to previous Slide in the active Item"
     *      description: "Sends a Midi-Note to Presenter to select the previous Slide in the active Item"
     *      responses:
     *          200:
     *              description: previous Slide has been selected
     *          404:
     *              description: Error, because Presenter isn't running
     *  @param {boolean} status status of Presenter
     *  @returns {number} 200 - previous Slide has been selected, 404 - Error, because Presenter isn't running
     */
    previousSlide(status) {
        if(this.checkPresenter('previousSlide', status)) {
            console.info('Presenter: Prevoius Slide will be executed');
            this.midiOut.sendMidiPresenter(5);
            return 200;
        }
        return 404; 
    }

    /**
     *  @swagger
     *  /presenter?action=nextSlide:
     *  get:
     *      tags: ["Presenter"] 
     *      summary: "Change to next Slide in the active Item"
     *      description: "Sends a Midi-Note to Presenter to select the next Slide in the active Item"
     *      responses:
     *          200:
     *              description: next Slide has been selected
     *          404:
     *              description: Error, because Presenter isn't running
     *  @param {boolean} status status of Presenter
     *  @returns {number} 200 - next Slide has been selected, 404 - Error, because Presenter isn't running
     */
    nextSlide(status) {        
        if(this.checkPresenter('nextSlide', status)) {
            console.info('Presenter: Next Slide will be executed');
            this.midiOut.sendMidiPresenter(6);
            return 200;
        }
        return 404; 
    }

    /**
     * @param {String} functionName Name of the function that will be executed
     * @param {boolean} status Status of Presenter
     * @returns {boolean} true - Presenter is running, false - Presenter is not running
     */
    checkPresenter(functionName, status) {
        if(!status) {
            console.error(`Error: Presenter is not running! Function ${functionName} will not be executed`);
            return false;
        }
        return true;
    }
}


class StudioOneFunction {
    constructor(midiOutput) {
        this.midiOut = midiOutput;
        this.rec = false;
    }

    /**
     *  @swagger
     *  /studioOne?action=startRec:
     *  get:
     *      tags: ["Studio One"]
     *      summary: "Start Recording in Studio One"
     *      description: "Sends a Midi-Command to Studio One to start recording"
     *      responses:
     *          200:
     *              description: Recording has started
     *          404:
     *              description: Error, because Studio One isn't running
     *          409:
     *              description: Error, because Studio One already has an active recording
     *  @param {boolean} status status of Studio One
     *  @returns {number} 200 - Recording has started, 404 - Error, because Studio One isn't running, 409 - Error, because Studio One already has an active recording
     */
    startRec(status) {
        if(!this.checkStudioOne('startRec', status)) return 404;
        if(this.rec){
            console.warn('Warning: There is currently an active recoring');
            return 409;
        }
        console.info('S1: Recording will be started');

        //TODO: Check Midi-Input for a "recording-started" signal
        this.rec = true;

        this.marker = 0;
        this.midiOut.sendMidiStudioOne(85);
        return 200;
    }

    /**
     *  @swagger
     *  /studioOne?action=stopRec:
     *  get:
     *      tags: ["Studio One"]
     *      summary: "Stop Recording in Studio One"
     *      description: "Sends a Midi-Command to Studio One to stop recording"
     *      responses:
     *          200:
     *              description: Recording has stopped
     *          404:
     *              description: Error, because Studio One isn't running
     *          409:
     *              description: Error, because Studio One already has no an active recording
     *  @param {boolean} status status of Studio One
     *  @returns {number} 200 - Recording has stopped, 404 - Error, because Studio One isn't running, 409 - Error, because Studio One already has no an active recording
     */
    stopRec(status) {
        if(!this.checkStudioOne('stopRec', status)) return 404;
        if(!this.rec){
            console.warn('Waring: There is currently no active recoring');
            return 409;
        }
        console.info('S1: Recording will be stopped');
        this.midiOut.sendMidiStudioOne(86);
        //TODO: Check Midi-Input for a "recording-stopped" signal
        this.rec = false;
        return 200;
    }

    /**
     *  @swagger
     *  /studioOne?action=setMarker:
     *  get:
     *      tags: ["Studio One"]
     *      summary: "Set Marker in Studio One"
     *      description: "Sends a Midi-Command to Studio One to set a Marker"
     *      responses:
     *          200:
     *              description: Marker has been set
     *          404:
     *              description: Error, because Studio One isn't running
     *          409:
     *              description: Error, because Studio One already has an active recording
     *  @param {boolean} status status of Studio One
     *  @returns {number} 200 - Marker has been set, 404 - Error, because Studio One isn't running, 409 - Error, because Studio One already has an active recording
     */
    setMarker(status) {
        if(!this.checkStudioOne('setMarker', status)) return 404;
        console.info('S1: Marker will be set');
        this.midiOut.sendMidiStudioOne(87);
        this.marker++;
        return 200;
    }

    /**
     *  @swagger
     *  /studioOne?action=setSelection:
     *  get:
     *      tags: ["Studio One"]
     *      summary: "Set Selection in Studio One"
     *      description: "Sends a Midi-Command to Studio One to set the selection to the recording length"
     *      responses:
     *          200:
     *              description: Selection has been set
     *          404:
     *              description: Error, because Studio One isn't running
     *          409:
     *              description: Error, because Studio One already has an active recording
     *  @param {boolean} status status of Studio One
     *  @returns {number} 200 - Selection has been set, 404 - Error, because Studio One isn't running, 409 - Error, because Studio One already has an active recording
     */
    setSelection(status) {
        if(!this.checkStudioOne('setSelection', status)) return 404;
        if(this.rec){
            console.warn('Warning: There is currently an active recoring');
            return 409;
        }
        console.info('S1: Markers will be set correctly to recording length');
        this.midiOut.sendMidiStudioOne(90);
        return 200;
    }

        /**
     *  @swagger
     *  /studioOne?action=normalizeAudio:
     *  get:
     *      tags: ["Studio One"]
     *      summary: "Normalize recorded Audio in Studio One"
     *      description: "Sends a Midi-Command to Studio One to normalize the recorded Audio-track"
     *      responses:
     *          200:
     *              description: Normalizing Process has started
     *          404:
     *              description: Error, because Studio One isn't running
     *          409:
     *              description: Error, because Studio One already has an active recording
     *  @param {boolean} status status of Studio One
     *  @returns {number} 200 - Normalizing Process has started, 404 - Error, because Studio One isn't running, 409 - Error, because Studio One already has an active recording
     */
    normalizeAudio(status) {
        if(!this.checkStudioOne('normalizeAudio', status)) return 404;
        if(this.rec){
            console.warn('Warning: There is currently an active recording');
            return 409;
        }
        console.info('S1: Normalizing Effect will be started');
        this.midiOut.sendMidiStudioOne(88);
        return 200;
    }

    /**
     *  @swagger
     *  /studioOne?action=exportAudio:
     *  get:
     *      tags: ["Studio One"]
     *      summary: "Export recorded Audio in Studio One"
     *      description: "Sends a Midi-Command to Studio One to export the recorded Audio-track"
     *      responses:
     *          200:
     *              description: Selection has been set
     *          404:
     *              description: Error, because Studio One isn't running
     *          409:
     *              description: Error, because Studio One already has an active recording
     *  @param {boolean} status status of Studio One
     *  @returns {number} 200 - Selection has been set, 404 - Error, because Studio One isn't running, 409 - Error, because Studio One already has an active recording
     */
    exportAudio(status) {
        if(!this.checkStudioOne('exportAudio', status)) return 404;
        if(this.rec){
            console.warn('Warning: There is currently an active recording');
            return 409;
        }
        console.info('S1: Exporting Process will be started');
        this.midiOut.sendMidiStudioOne(89);
        return 200;
    }

    /**
     * @param {string} functionName Name of the function that will be executed
     * @param {boolean} status Status of Studio One
     * @returns {boolean} true - Studio One is running, false - Studio One is not running
     */
    checkStudioOne(functionName, status) {
        if(!status) {
            console.error(`Error: Studio One is not running! Function ${functionName} will not be executed`);
            return false;
        }
        return true;
    }

    /**
     *  @swagger
     *  /get?feedback=recStatus:
     *  get:
     *      tags: ["Feedback"]
     *      summary: "Get rec status"
     *      description: "Returns the current Recording Status from Studio One"
     *      responses:
     *          true:
     *             description: Studio One is currently recording
     *          false:
     *            description: Studio One is not recording
     *  @returns {number} the count of markers in the current recording
     */
    sendCompainionMarker() {
        return this.marker;
    }
    /**
     * @swagger
     *  /get?feedback=markerCount:
     *  get:
     *      tags: ["Feedback"]
     *      summary: "Get Marker Count"
     *      description: "Returns the current Marker Count from Studio One"
     *      responses:
     *          0-N:
     *            description: The current Marker Count
     *  @returns {boolean} the status of the current recording
     */
    sendCompanionRecStatus(){
        return this.rec;
    }
}

module.exports = { StudioOneFunction, PresenterFunction };