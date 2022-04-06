const PORT = 8010;
const fs = require('fs')
const express = require('express');
const app = express();
const url_parse = require('url-parse');
const midi = require('easymidi');

let clientIP;

printDebugInfo('Webserver for communication between Companion and Studio One\n\nTrying to start the server...\n', 'info');


//For Frontend: please consider watching the tutorial on how to make a frontend with html in express.js
//https://www.youtube.com/watch?v=1wXYg8Eslnc


// let midiOutput = new midi.Output('QUAD-CAPTURE');

app.get('/kill', (req, res) => {
    //midiOutput.close();
    printDebugInfo('Application will shut down', 'info')
    process.exit();
});
app.get('/send', function(req, res){
    let url = url_parse(req.url, true).query.action;
    clientIP = req.ip;
    //console.log(url);
    res.send('Request recieved!');
    switch (url){
        case 'startRec': 
            printDebugInfo('Recording will be started', 's1'); 
            sendMidiStudio(85);
            break;
        case 'stopRec': 
            printDebugInfo('Recording will be stopped', 's1');
            sendMidiStudio(86);
            break;
        case 'setMarker':
            printDebugInfo('Marker will be set', 's1');
            sendMidiStudio(87);
            break;
	    case 'setEndMarker': 
            printDebugInfo('Markers will be set correctly to recording length', 's1');
            sendMidiStudio(90);
            break;
        case 'normalize':
            printDebugInfo('Normalizing Effect will be started', 's1');
            sendMidiStudio(88);
            break;
        case 'exportAudio': 
            printDebugInfo('Exporting Process will be started', 's1');
            sendMidiStudio(89);
            break;
        case 'changeItem': 
            printDebugInfo('Item Selection will be changed', 'presenter');
            sendMidiPresenter(0);
            break;
        case 'prevItem': 
            printDebugInfo('Prevoius Item will be executed', 'presenter');
            sendMidiPresenter(2);
            break;
        case 'nextItem': 
            printDebugInfo('Next Item will be executed', 'presenter');
            sendMidiPresenter(3);
            break;
        case 'changeSlide': 
            printDebugInfo('Slide Selection will be changed', 'presenter');
            sendMidiPresenter(4);
            break;
        case 'prevSlide': 
            printDebugInfo('Prevoius Slide will be executed', 'presenter');
            sendMidiPresenter(5);
            break;
        case 'nextSlide': 
            printDebugInfo('Next Slide will be executed', 'presenter');
            sendMidiPresenter(6);
            break;
        default: console.log('Action not detected! Error!'); break;     
    }
});

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`);
});

function sendMidiStudio(cc){
    
    /*midiOutput.send("cc", {
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
    }, 200);*/
}
function sendMidiPresenter(note){
    /*midiOutput.send("noteon", {
        note: note,
        value: 127,
        channel: 2
    });*/
}
function printDebugInfo(text, state){
    if(state == 's1'){
        console.log('\x1b[34m', `http2s1: ${text}`);
    } 
    else if(state == 'presenter') {
        console.log('\x1b[32m', `http2presenter: ${text}`)
    }
    else if(state = 'info'){
        console.log('\x1b[37m', `Info: ${text}`);
    }
}