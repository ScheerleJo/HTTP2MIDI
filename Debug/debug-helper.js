import { callHandler } from "../module";

var xmlhttp = new XMLHttpRequest();

document.getElementById('StartRec').addEventListener('click', function(){
    sendAction('startRec');
});
document.getElementById('StopRec').addEventListener('click', function(){
    sendAction('stopRec');
});
document.getElementById('SetMarker').addEventListener('click', function(){
    sendAction('setMarker');
});
document.getElementById('SelectAudio').addEventListener('click', function(){
    sendAction('setEndMarker');
});
document.getElementById('NormalizeAudio').addEventListener('click', function(){
    sendAction('normalize');
});
document.getElementById('ExportAudio').addEventListener('click', function(){
    sendAction('exportAudio');
});
document.getElementById('setFirstItem').addEventListener('click', function(){
    sendAction('changeItem');
});

document.getElementById('prevItem').addEventListener('click', function(){
    sendAction('prevItem');
});
document.getElementById('nextItem').addEventListener('click', function(){
    sendAction('nextItem');
});
document.getElementById('setFirstSlide').addEventListener('click', function(){
    sendAction('changeSlide');
});
document.getElementById('prevSlide').addEventListener('click', function(){
    sendAction('prevSlide');
});
document.getElementById('nextSlide').addEventListener('click', function(){
    sendAction('nextSlide');
});

document.getElementById('killServer').addEventListener('click', function(){
    xmlhttp.open("GET", 'http://localhost:8010/kill');
    xmlhttp.send();
});

/**
 * Send Request via HTTP oder Local
 * @param  {string} action
 */
function sendAction(action){
    //if(radioButtons() == 'http'){
    alert(radioButtons());
    let url = `http://localhost:8010/send?action=${action}`;
    xmlhttp.open("GET", url);
    xmlhttp.send();
    return xmlhttp.responseText;
    //} else {
        //callHandler(action, radioButtons())
    //}
}

function radioButtons() {
    const radioButtons = document.querySelectorAll('input[name="switch"]');
    let select;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            select = radioButton.value;
            break;
        }
    }
    return select;
}