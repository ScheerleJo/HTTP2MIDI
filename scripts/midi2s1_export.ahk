#SingleInstance, force

CoordMode, Mouse, Screen
sleep 100
varStudio := WinExist("Studio One")
if (varStudio != 0){
    ;BlockInput MouseMove
    MouseMove, 1203, 267				;to Folder Selection
    Click Left
    Sleep, 200
    Click Left
    Sleep, 50
    SendInput, C:\AktuellerGodi
    Send, {Enter}
    Loop, 7 { 
       Send, {Tab} 
    }
    Send, {Enter}
    Sleep, 50
    MouseMove, 1067, 313			;to Name
    Click Left
    FormatTime, varDate,, yyyy-MM-dd
    SendInput, %varDate%_godi
    MouseMove, 1517, 788			;to Export Button
    Click Left
}
;BlockInput, MouseMoveOff

ExitApp, 1 