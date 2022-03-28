const PORT = 8010;

const express = require('express');
const app = express();
const url_parse = require('url-parse');
const midi = require('easymidi');

let clientIP;

console.log('Webserver for communication between Companion and Studio One\n\nTrying to start the server...\n')


// let midiOutput = new midi.Output('QUAD-CAPTURE');

app.get('/kill', (req, res) => {
    midiOutput.close();
    process.exit();
});
app.get('/send', function(req, res){
    let url = url_parse(req.url, true).query.action;
    clientIP = req.ip;
    //console.log(url);
    res.send('Request recieved!');
    switch (url){
        case 'startRec': 
            console.log('Recording will be started'); 
            sendMidiStudio(85);
            break;
        case 'stopRec': 
            console.log('Recording will be stopped');
            sendMidiStudio(86);
            break;
        case 'setMarker':
            console.log('Marker will be set');
            sendMidiStudio(87);
            break;
	    case 'setEndMarker': 
            console.log('Markers will be set correctly to recording length');
            sendMidiStudio(90);
            break;
        case 'normalize':
            console.log('Normalizing Effect will be started');
            sendMidiStudio(88)
            break;
        case 'exportAudio': 
            console.log('Exporting Process will be started');
            sendMidiStudio(89);
            break;
        case 'changeItem': 
            console.log('Item Selection will be changed');
            sendMidiPresenter(0);
            break;
        case 'prevItem': 
            console.log('Prevoius Item will be executed');
            sendMidiPresenter(2);
            break;
        case 'nextItem': 
            console.log('Next Item will be executed');
            sendMidiPresenter(3);
            break;
        case 'changeSlide': 
            console.log('Slide Selection will be changed');
            sendMidiPresenter(4);
            break;
        case 'prevSlide': 
            console.log('Prevoius Slide will be executed');
            sendMidiPresenter(5);
            break;
        case 'nextSlide': 
            console.log('Next Slide will be executed');
            sendMidiPresenter(6);
            break;
        default: console.log('Action not detected! Error!'); break;     
    }
});

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`);
});

function sendMidiStudio(cc){
    midiOutput.send("cc", {
        controller: cc,
        value: 127,
        channel: 1
    });
    setTimeout(() => {
        midiOutput.send("cc", {
            controller: cc,
            velocity: 0,
            channel: 1
        })
    }, 200);
}
function sendMidiPresenter(note){
    midiOutput.send("noteon", {
        note: note,
        value: 127,
        channel: 2
    });
}