const PORT = 8010;

const express = require('express');
const app = express();
const url = require('url-parse');
const midi = require('easymidi');

let midiOutput = new midi.Output("Name", true);

// midiOutput.on('message', (deltaTime, message) =>{
//     console.log(`m: ${message} d:${deltaTime}`);
// });
// midiOutput.openVirtualPort("HTTP-Controller");

/*
midiOutput.send("noteon", {
    controller: 84
    value: 127,
    channel: 1
}
})
setTimeout(() => {
    midiOutput.send("noteoff", {
        note: 12 * 5,
        velocity: 127,
        channel: 1
    })
}, 200);


67  --> g
67  --> g
56  --> V
52  --> R
59  --> Y
49  --> I
50  --> P
55  --> U
59  --> Y
49  --> I






*/

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
