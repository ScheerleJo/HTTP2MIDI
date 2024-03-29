# HTTP2MIDI

This application uses a Node.js Webserver, which handles basic conversion from an HTTP-Request to a MIDI signal.
The MIDI signal controls the Recording DAW (Digital Audio Workstation), in this case [Presonus' Studio One](https://www.presonus.com/products/Studio-One) on Midi-Channel 1. In Addition to that, there is the control for "Presenter" by [WorshipTools](https://www.worshiptools.com/en-us) on Midi-Channel 2.

## Own Usecase

The basic idea is to press a button on an Elgato Streamdeck running [Companion](https://github.com/bitfocus/companion). It sends an HTTP-Request to the computer running Studio One and Presenter for audio recording and visuals. There the MIDI signal gets created and input into the programs.

In our case, the MIDI signal gets sent through an audio interface that supports midi. That allows us to create and get the MIDI commands on one Laptop via hardware and no additional software.
However, it would be smarter to use a MIDI-Loopback adapter like [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) from Tobias Erichson.
In a future version of this software, I want to eliminate the need for separate soft- or hardware by creating my own in software MIDI-Loopback.

! The attribute "original Name" is just for me, so I dont have to look up the original Name of our local MIDI-Interface :D

## How it works

The already mentioned concept is that the Webserver gets an HTTP-Request looking something like that:

```url
http://localhost:8010/send/?action=*myaction*
```

For all commands check the [Command-list](./command_list.md).

The Webserver then outputs a normal MIDI-CC-Signal `CC = Control-Change` looking something like that but in hex for Studio One:

```js
{
  channel: 1,
  controller: 0-127,
  velocity: 0-127
}
```

and the following sample for Presenter:

```js
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

```cmd
npm install
```

After that, you are ready to go and can start the application with the command:

```cmd
npm run startup
```

### Studio One Setup

For the configuration in Studio-One, you have to follow two main steps.

First, you create a "Control Surface" as a MIDI input Listener. There you select the midi input you want to listen on.
For the server to function correctly and get the current recording status, you need to set up a new instrument and select the MIDI output you have entered in the config file for http2midi. You also need to activate at least one of the midi channels for Studio-One to send the information.

## Your Own Customization

Coming Soon!

## Future Plans

The plan is to eventually move the MIDI-Output from a physical to a virtual Port. Maybe with the help of [Tobias Erichsen](https://www.tobias-erichsen.de/), the creator of various virtual midi applications.

- program Status for midi2presenter_startup.ahk
- move Midi-stuff to separate js file
- get current Presenter status
- describe how to compile the application to an .exe
- create Installer to automatically update from latest Release and install all necessary stuff in the beginning
- Move debug-Helper to swagger or something equivalent
- optimize file structure
- make a Rework for generic use to add to Companion as official Package

## Developer

<img src="https://avatars.githubusercontent.com/ScheerleJo" height="50px" title="Josia Scheerle"/> | [`@ScheerleJo`](https://github.com/ScheerleJo)
