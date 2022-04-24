# HTTP2MIDI

This application uses a Node.js Webserver, which handles basic conversion from an HTTP-Request to a MIDI signal. 
The MIDI signal controls the Recording DAW (Digital Audio Workstation), in this case [Presonus' Studio One](https://www.presonus.com/products/Studio-One) on Midi-Channel 1. In Addition to that, there is the control for "Presenter" by [WorshipTools](https://www.worshiptools.com/en-us) on Midi-Channel 2.

## Own Usecase
The basic idea is to press a button on an Elgato Streamdeck running [Companion](https://github.com/bitfocus/companion). It sends an HTTP-Request to the computer running Studio One and Presenter for audio recording and visuals. There the Midi Signal gets created and input into the programs.


# How it works
The already mentioned concept is that the Webserver gets an HTTP-Request looking like that:
```
http://localhost:8004/send/?action=*myaction*
```
The Webserver then outputs a normal MIDI-CC-Signal `CC = Control-Change` looking something like that but in hex for Studio One:
``` AHK
{
  channel: 1,
  controller: 0-127,
  velocity: 0-127
}
```
and the following sample for Presenter:
``` AHK
{
  note: 1-6,
  value: 127,
  channel: 2
}
```

For your use, you have to edit the parameters of the default.json config-file. That is for several reasons: 
1. To suit your environment
2. To test/debug, or 
3. even upgrade the software.

If you use the software and have ideas to upgrade, please let me know. This applies if you upgrade the software on your own, too.

## Installation
! Warning!

You are in need for the Desktop Software Development Kit in C++ and a [Python Version](https://www.python.org/downloads/). You have to install these before installing your node packages.

For the Desktop Software Development Kit in C++ you simply have to downlad and install the [Installer](https://visualstudio.microsoft.com/de/downloads/) (The Community Version is free and supported).
Next you open the installer if it isn't already, and select the Desktop Software Development Kit in C++. You don't need anything else for this application. After this installation you are good to go!

Like any other Node.js Webserver, you download this repository and extract it into a folder of your choice. In there, you open the command prompt and type in:
```
npm install
```
After that, you are ready to go and can start the application with the command:
```
npm run startup
```

## Future Plans
The plan is to eventually move the MIDI-Output from a physical to a virtual Port. Maybe with the help of [Tobias Erichsen](https://www.tobias-erichsen.de/), the creator of various virtual midi applications.
### ToDos
- Test the Webserver in the church
- update Companion
- add Variables for callback in Companion
- implement the WorshipTools api to automate Presenter and Planning (if it is possible without an API)

#### AutoHotkey
- program AutoExport script
- program script for connecting midi2presenter

## Developer

<img src="https://avatars.githubusercontent.com/ScheerleJo"   height="50px" title="Josia Scheerle"/> | [`@ScheerleJo`](https://github.com/ScheerleJo)
