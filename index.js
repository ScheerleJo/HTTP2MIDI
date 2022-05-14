const lib = require('./module');
const cors = require('cors');
const express = require('express');
const app = express();

/*  This Webserver, written by ScheerleJo aka. Josia Scheerle,  makes it possible to accept HTTP-Requests and output MIDI
    It is used to control various programs with MIDI like StudioOne and Presenter
    first edit: 08.02.2022
    latest edit: 14.05.2022
*/

//#region PreStartup Things
lib.printDebugInfo('Webserver for communication between Companion and Studio One\n\n Trying to start the server...\n', 'info');

// eslint-disable-next-line no-undef
let dir = __dirname;

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST"
}

app.use(cors(corsOptions));
app.use(express.static(dir));
app.use(express.static(dir + '/views'));
app.use(express.static(dir + '/views/images'));
app.use(express.static(dir + '/scripts'));


lib.loadConfig({

}); 
//#endregion

//#region RequestHandlers
app.get('/', (req, res) =>{
    res.sendFile(dir + '/views/debug-helper.html');
});
/**
 * shuts down the Webserver gracefully
 * 
 * !Querystring '/kill' cannot be used differently
 */
app.get('/kill', (req, res) => {
    res.json({'status':'Shutdown'});
    lib.printDebugInfo('Application will shut down', 'info')
    lib.killMidiOutput();
    this.process.exit();
});
/**
 * /send is used to handle the function-calling process
 */
app.get('/send', (req, res) => {
    res.json(lib.handleAction(req.url, 'Http'));
});
/**
 * Handle Callbacks from AutoHotkey to determine wehter the scripts were successful
 */
app.get('/send/callback', (req, res) => {
    lib.handleCallback(req.url);
    res.write('');  //Send something to not have an infinite Request
})
/**
 * /debug is used to handle the actions made in the Debug-Helper
 */
app.get('/debug', (req, res) => {
    res.json(lib.handleAction(req.url, 'Debug'));
});

/**
 * builds the Webserver
 */
app.listen(lib.PORT, function(){        
    lib.printDebugInfo(` Server running on Port ${lib.PORT}`, 'info');
});
//#endregion