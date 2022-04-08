document.getElementById('killServer').addEventListener('click', function(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", 'http://localhost:8010/kill');
    xmlhttp.send();
});
document.getElementById('StartRec').addEventListener('click', function(){
    // alert('startRec');
    httpGet('startRec')
});
document.getElementById('StopRec').addEventListener('click', function(){
    // alert('stopRec');
    httpGet('stopRec')
});
document.getElementById('SetMarker').addEventListener('click', function(){
    // alert('setMarker');
    httpGet('setMarker')
});
document.getElementById('SelectAudio').addEventListener('click', function(){
    // alert('selectAudio');
    httpGet('setEndMarker')
});
document.getElementById('NormalizeAudio').addEventListener('click', function(){
    // alert('normalizeAudio');
    httpGet('normalize')
});
document.getElementById('ExportAudio').addEventListener('click', function(){
    // alert('exportAudio');
    httpGet('exportAudio')
});


document.getElementById('setFirstItem').addEventListener('click', function(){
    // alert('setFirstItem');
    httpGet('changeItem')
});
document.getElementById('prevItem').addEventListener('click', function(){
    // alert('prevItem');
    httpGet('prevItem')
});
document.getElementById('nextItem').addEventListener('click', function(){
    // alert('nextItem');
    httpGet('nextItem')
});
document.getElementById('setFirstSlide').addEventListener('click', function(){
    // alert('setFirstSlide');
    httpGet('changeSlide')
});
document.getElementById('prevSlide').addEventListener('click', function(){
    // alert('prevSlide');
    httpGet('prevSlide')
});
document.getElementById('nextSlide').addEventListener('click', function(){
    // alert('nextSlide');
    httpGet('nextSlide')
});

function httpGet(action){
    let url = `http://localhost:8010/send?action=${action}`;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url);
    xmlhttp.send();
    return xmlhttp.responseText();
}


