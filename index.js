const PORT = 8010;
const lib = require('./module');
const express = require('express');
const cors = require('cors');
const app = express();

/*  This Webserver, written by ScheerleJo aka. Josia Scheerle,  makes it possible to accept HTTP-Requests and output MIDI
    It is used to control various programs with MIDI like StudioOne and Presenter
    first edit: 08.02.2022
    latest edit: 12.04.2022
*/

//#region PreStartup Things
let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST"
}

app.use(cors(corsOptions));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/views/images'));
app.use(express.static(__dirname + '/scripts'));


lib.printDebugInfo('Webserver for communication between Companion and Studio One\n\n Trying to start the server...\n', 'info', 'local');
lib.loadConfig(); 
//#endregion

//#region RequestHandlers
app.get('/', (req, res) =>{
    lib.writeToJSONfile();
    res.sendFile(__dirname + '/views/debug-helper.html');
    lib.printDebugInfo('The Localhost Debug-Helper has been accessed','info', 'local');
});

app.get('/kill', (req, res) => {    //shuts down the Webserver gracefully
                                    //querystring cannot be used differently
    res.json({'status':'Shutdown'});
    lib.resetJSONobject();
    lib.printDebugInfo('Application will shut down', 'info')
    lib.killMidiOutput();
    process.exit();
});
app.get('/send', (req, res) => {    // /send is used to handle the function-calling process
    res.json(lib.handleAction(req.url, 'http'));
});

app.listen(PORT, function(){        //builds the Webserver
    console.log(` Server running on Port ${PORT}`);
});
//#endregion