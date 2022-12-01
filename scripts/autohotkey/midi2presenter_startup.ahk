#SingleInstance, force

sleep 100
varState := 0

CoordMode, Mouse, Screen
varActive := WinExist("Presenter")
if (varActive != 0){
    BlockInput MouseMove
    MouseMove, 1869, 63		;to Settings Icon
    Click Left
    Sleep, 50
    MouseMove, 1724, 241	;to Settings
    Click Left
    Sleep, 100
    MouseMove, 385, 846		;to MIDI-Section
    Click Left
    Sleep, 50
    MouseMove, 1724, 241	;to Connect with MIDI-Network
    Click Left
    Sleep 50
    MouseMove, 1751, 353	;to MIDI-Port
    Click Left
    MouseMove, 166, 64		;to Presenter Logo
    Click Left
    BlockInput, MouseMoveOff
    PixelGetColor, varColor, X, Y , RGB
    if (varColor := ) {
        varState := 1
    }
}

if (varState == 1) {
    Run, curl ""http://localhost:8010/send/callback?program=presenter&state=true"", , Hide
}
else {
    Run, curl ""http://localhost:8010/send/callback?program=presenter&state=false"", , Hide
}
ExitApp, 1 