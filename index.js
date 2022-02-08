const PORT = 8010;

const express = require('express');
const app = express();
const url = require('url-parse');
const midi = require('easymidi');
const { output } = require('midi');
// const midi = require('midi');

let midiOutput = new midi.Output("Name", true);

// midiOutput.on('message', (deltaTime, message) =>{
//     console.log(`m: ${message} d:${deltaTime}`);
// });
// midiOutput.openVirtualPort("HTTP-Controller");

midiOutput.send("noteon", {
    note: 12 * 5,
    velocity: 127,
    channel: 1
})
setTimeout(() => {
    midiOutput.send("noteoff", {
        note: 12 * 5,
        velocity: 127,
        channel: 1
    })
}, 200);





app.get('/send', function(req, res){
    // console.log(url(req.url, true).query);
    res.send('Request recieved!');
    
    switch (url(req.url, true).query['action']){
        case 'startRec': console.log('Recording will be started'); break;
        case 'stopRec': console.log('Recording will be stopped'); break;
        case 'setMarker': console.log('Marker will be set'); break;
        default: console.log('Action not detected! Error!'); break;     
    }
});

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`);
});

function sendMidi(){
}
