# HTTP2MIDI

This Repository includes a node.js Webserver, which handles basic conversion from an HTTP-Request to a MIDI signal. 
The Aforementioned MIDI Signal is used to control recording a DAW (Digital Audio Workstation), in this case [Presonus' Studio One](https://www.presonus.com/products/Studio-One) on Midi-Channel 1.
New Functionality: The Implementation for midi2presenter by [WorshipExtreme](https://www.worshipextreme.com/en-us) on Midi-Channel 2.

## Own Usecase
The basic idea is, that when you press a button on a Streamdeck running [Companion](https://github.com/bitfocus/companion) it sends an HTTP-Request to the computer running Studio One for audio recording. There the Midi Signal gets created and input in the DAW.


## How it works
The Basic concept is, that the webserver gets an HTTP-Request looking like that:
```
http://localhost:8004/send/?action=*myaction*
```
The Webserver outputs a normal MIDI-CC-Signal `CC = Controll-Change` looking something like that but in hex:
```
channel: 0-15,
controller: 0-127,
velocity: 0-127
```


## Future Plans
- In the future it is planned to keep this script updated and eventually move the physical MIDI-Output to a virtual Port. This may be accomplished with the help of [Tobias Erichsen](https://www.tobias-erichsen.de/).
- Also an automation for exporting the recorded audio into mp3 files with the press of a button would be pretty nice. :smile:
- I am currently researching to implement a feedback function, which should tell you if the recording is runnig and how many track marker you have set.
- Complete the in construction Debug-Helper to test the functions and get callbacks correctly.

### TODOs:s
-   create script for connecting midi2presenter

## Developer

<img src="https://avatars.githubusercontent.com/ScheerleJo"   height="50px" title="Josia Scheerle"/> | [`@ScheerleJo`](https://github.com/ScheerleJo)
