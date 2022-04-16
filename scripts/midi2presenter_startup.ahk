#SingleInstance, force

sleep 1000
; BlockInput MouseMove
CoordMode, Mouse, Screen
varActive := WinExist("Presenter")
if (varActive != 0){
    MouseMove, ;to Settings Icon
    Click Left
    Sleep, 50
    MouseMove, ;to Settings
    Click Left
    Sleep, 100
    MouseMove, ;to MIDI-Section
    Click Left
    Sleep, 50
    MouseMove, ;to Connect with MIDI-Network
    Click Left
    Sleep 50
    MouseMove, ;to MIDI-Port
    Click Left
    MouseMove, ;to Presenter Logo
    Click Left
}
else {
    MsgBox, Presenter isn't active
}
ExitApp, 1 