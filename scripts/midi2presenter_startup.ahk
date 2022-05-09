#SingleInstance, force

sleep 100
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
}
else {
    MsgBox, Presenter isn't active
}
ExitApp, 1 