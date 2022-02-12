;HEADER START

;This script is written by Josia Scheerle
;to start a node.js webserver for HTTP2MIDI via a command prompt
;Last edit: 12.02.22
#SingleInstance, force
;HEADER END

sleep 1000
BlockInput MouseMove
ToolTip, Starting Node.js Webserver
Run, cmd.exe
Sleep, 1000
SendInput, npm run startup {Enter}
BlockInput MouseMoveOff
Sleep, 1000
WinWait, npm run startup
Sleep, 1000
WinMinimize 

ExitApp, 1