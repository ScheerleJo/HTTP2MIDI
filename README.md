# HTTP2MIDI

This Repository includes a node.js Webserver, which handles basic conversion from an HTTP-Request to a MIDI signal. 
The Aforementioned MIDI Signal is used to control recording a DAW (Digital Audio Workstation), in this case [Presonus' Studio One](https://www.presonus.com/products/Studio-One) on Midi-Channel 1. In Addition to that, there is the control for Presenter by [WorshipExtreme](https://www.worshipextreme.com/en-us) on Midi-Channel 2.

## Own Usecase
The basic idea is, that when you press a button on a Elgato Streamdeck running [Companion](https://github.com/bitfocus/companion) it sends an HTTP-Request to the computer running Studio One and Presenter for audio recording and visuals. There the Midi Signal gets created and input in the programs.


## How it works
The already mentioned concept is, that the Webserver gets an HTTP-Request looking like that:
```
http://localhost:8004/send/?action=*myaction*
```
The Webserver then outputs a normal MIDI-CC-Signal `CC = Controll-Change` looking something like that but in hex for Studio One:
``` AHK
{
  channel: 1,
  controller: 0-127,
  velocity: 0-127
}
```
and the following sample for Presenter:
```AHK
{
  note: 1-6,
  value: 127,
  channel: 2
}
```

## Future Plans /ToDos
- In the future it is planned to keep this script updated and eventually move the physical MIDI-Output to a virtual Port. This may be accomplished with the help of [Tobias Erichsen](https://www.tobias-erichsen.de/), the creator of various virtualMidi applications.

- Update ReadMe to warn about config.json

#### AutoHotkey
- program AutoExport script
- program script for connecting midi2presenter
#### Debug-Helper
- create more Status indications (deactivateMidi, deactivateAutoExport, MidiOutput)
- make the config accessable trough json file to be configured in html and in the json
- maybe restart the debug-helper?


## Developer

<img src="https://avatars.githubusercontent.com/ScheerleJo"   height="50px" title="Josia Scheerle"/> | [`@ScheerleJo`](https://github.com/ScheerleJo)
