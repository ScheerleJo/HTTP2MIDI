// This Webserver, written by ScheerleJo aka. Josia Scheerle,  makes it possible to accept HTTP-Requests and output MIDI
// It is used to control various programs with MIDI like StudioOne and Presenter
// first edit: 08.02.2022
// latest edit: 11.04.2022

const PORT = 8010;
const lib = require('./module');
const express = require('express');
const cors = require('cors');
const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST"
}

lib.deactivateMidiAction(true);     //determines whether the MIDI-Output is actually used

lib.printDebugInfo('Webserver for communication between Companion and Studio One\n\nTrying to start the server...\n', 'info', 'local');
lib.startMidiOutput();              //start MIDI-Output, when 'deactivateMIDI' is false


app.use(cors(corsOptions));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/views/images'))

app.get('/', (req, res) =>{
    res.sendFile(lib.debugPath());
    lib.writeToJSONfile();
    lib.printDebugInfo('The Localhost Debug-Helper has been accessed','info', 'local')
    // res.json(lib.returnJSONdata());
});

app.get('/kill', (req, res) => {    //shuts down the Webserver gracefully
                                    //querystring cannot be used differently
    res.send('Warning: Application will shut down');
    lib.printDebugInfo('Application will shut down', 'info')
    lib.killMidiOutput();
    process.exit();
});
app.get('/send', (req, res) => {    // /send is used to handle the function-calling process 
    res.json(lib.handleAction(req.url, 'http'));
});

app.listen(PORT, function(){        //builds the Webserver
    console.log(`Server running on Port ${PORT}`);
});