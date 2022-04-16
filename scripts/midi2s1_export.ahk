#SingleInstance, force

CoordMode, Mouse, Screen
sleep 100
varStudio := WinExist("Studio One")
if (varStudio == 0){
    BlockInput MouseMove
    MouseMove, ;to Folder Selection
    Click Left
    Loop, {
        varSelect := WinExist("Ordner auswählen")
        if (varSelect == 0) {
            MouseMove, ;to FolderPath
            Click Left
            SendInput, C:\Aktueller Godi
            Send, {Enter}
            Loop, 7 { 
                Send, {Tab} 
            }
            Send, {Enter}
            Sleep, 50
            MouseMove, ;to Name
            Click Left
            FormatTime, varDate,, yyyy-MM-dd
            SendInput, %varDate%_godi
            MouseMove, ;to Export Button
            Click Left
        }
        else {
            sleep, 50
        }
    }
    BlockInput, MouseMoveOff
}
ExitApp, 1 