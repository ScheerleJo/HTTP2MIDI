const PORT = 8010;
const lib = require('./module');
const express = require('express');
const app = express();

lib.deactivateMidiAction(true);

lib.printDebugInfo('Webserver for communication between Companion and Studio One\n\nTrying to start the server...\n', 'info');
lib.startMidiOutput();

//TODO: For Frontend: please consider watching the tutorial on how to make a frontend with html in express.js
//https://www.youtube.com/watch?v=1wXYg8Eslnc

app.get('/kill', (req, res) => {
    lib.printDebugInfo('Application will shut down', 'info')
    lib.killMidiOutput();
    process.exit();
});
app.get('/send', function(req, res){
    res.send('Request recieved!'); 
    lib.handleHttpAction(req.url);
});

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`);
});
