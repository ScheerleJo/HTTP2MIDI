const PORT = 8010;

const express = require('express');
const app = express();
const url_parse = require('url-parse');
const midi = require('easymidi');

console.log('Webserver for communication between Companion and Studio One\n\nTrying to start the server...\n')


let midiOutput = new midi.Output('QUAD-CAPTURE');

app.get('/kill', (req, res) => {
    midiOutput.close();
    process.exit();
});
app.get('/send', function(req, res){
    let url = url_parse(req.url, true).query.action;
    //console.log(url);
    res.send('Request recieved!');
    switch (url){
        case 'startRec': 
            console.log('Recording will be started'); 
            sendMidi(85);
            break;
        case 'stopRec': 
            console.log('Recording will be stopped');
            sendMidi(86);
            break;
        case 'setMarker':
            console.log('Marker will be set');
            sendMidi(87);
            break;
	    case 'setEndMarker': 
            console.log('Markers will be set correctly to recording length');
            sendMidi(90);
            break;
        case 'normalize':
            console.log('Normalizing Effect will be started');
            sendMidi(88)
            break;
        case 'exportAudio': 
            console.log('Exporting Process will be started');
            sendMidi(89);
            break;
        default: console.log('Action not detected! Error!'); break;     
    }
});

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`);
});

function sendMidi(cc){
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