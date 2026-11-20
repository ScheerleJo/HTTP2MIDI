# HTTP2MIDI

This application uses a Node.js Webserver, which handles basic conversion from an HTTP-Request to a MIDI signal.
The MIDI signal controls the Recording DAW (Digital Audio Workstation), in this case [Presonus' Studio One](https://www.presonus.com/products/Studio-One), and "Presenter" by [WorshipTools](https://www.worshiptools.com/en-us).

The tool is also very customizable since the rework in Version v1.4. More on that [here](#your-own-customization)

## Our Usecase

The basic idea is to press a button on an Elgato Streamdeck running [Companion](https://github.com/bitfocus/companion). It sends an HTTP-Request to the computer running Studio One and Presenter for audio recording and visuals. There the MIDI signal gets created and input into the programs.

In our case, the MIDI signal gets sent through an audio interface that supports MIDI. That allows us to create and get the MIDI commands on one laptop via hardware.
Without such an interface, you need a software MIDI-Loopback, see [MIDI ports](#midi-ports).

## How it works

The Webserver gets an HTTP-Request, which you can find in the [Command-list](./command_list.md).

It then outputs a MIDI-CC-Signal `CC = Control-Change` for Studio One:

```js
{
  channel: 1,         // = MIDI channel 2 (easymidi counts channels from 0)
  controller: 85-90,
  value: 127          // followed by value 0 after 200ms
}
```

and a Note-On for Presenter:

```js
{
  note: 0-6,
  velocity: 127,
  channel: 2          // = MIDI channel 3
}
```

The recording status (`/get?feedback=recStatus`) is only set by the MIDI feedback from Studio One, so it shows whether a recording is really running.

### Swagger

If you want to test single functions, open `http://localhost:8010/api-docs`, the integrated Swagger-UI. There you have all functions listed and can check each individual one.

## Installation

### Option 1: Download the release (recommended)

1. Download the latest `http2midi-<version>-win-x64.zip` from the [Releases](https://github.com/ScheerleJo/http2midi/releases) page.
2. Extract it into a folder of your choice.
3. Set up your [MIDI ports](#midi-ports) and enter their names in `config/server_config.json`.
4. Start `http2midi.exe`.

Node.js is not needed. If the `config` folder is missing, http2midi creates a default configuration next to the exe on the first start. You can start the exe from anywhere (e.g. via a shortcut or autostart), the configuration is always read from the folder of the exe.

### Option 2: Run from source

You need [Node.js](https://nodejs.org/) 24 or newer. Download or clone this repository, open a command prompt in the folder and type in:

```cmd
npm install
npm run startup
```

No Python or build tools are needed, the MIDI library ships precompiled binaries.

### MIDI ports

http2midi needs one MIDI port to send commands (`midiOutputConfig`) and optionally one to receive the recording status from Studio One (`midiInputConfig`). Enter the exact port names in `config/server_config.json`:

```json
"midiOutputConfig": { "name": "http2midiOut", "active": true },
"midiInputConfig":  { "name": "http2midiIn",  "active": true }
```

If a port is not found, http2midi lists all available MIDI ports at startup, so you can copy the correct name.

Ways to get the ports:

- **MIDI interface (hardware):** use the ports of your audio interface.
- **[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)** by Tobias Erichsen: create two ports, e.g. `http2midiOut` and `http2midiIn`.
- **Windows MIDI Services** (Windows 11): the new Windows MIDI stack has built-in loopback endpoints, which can be created in the Windows MIDI Settings app without additional software. *Not yet tested with Studio One and Presenter.*

All settings in the config file can also be overridden on the command line, e.g. `http2midi.exe --server:port=8011`.

### Studio One Setup

For the configuration in Studio One, you have to follow two main steps.

First, you create a "Control Surface" as a MIDI input listener. There you select the MIDI port that http2midi sends to (`midiOutputConfig`).
For the server to get the current recording status, you need to set up a new instrument and select the MIDI port you have entered as `midiInputConfig`. You also need to activate at least one of the MIDI channels for Studio One to send the information.

## Your Own Customization

Since version 1.4, http2midi can be easily configured and extended to cover your use case.

Depending on your requirements, 3 steps are necessary.

1. This step can be skipped if you only want to send notes and CC signals via MIDI. Otherwise you have to add another function to the `MidiOutput` class in `scripts/midi.js` with the desired MIDI signal type. You can find the documentation of the package [here](https://www.npmjs.com/package/easymidi).

    ```JS
    // This is a sample for a function in the midi.js to send a midi note
    sendMidiNoteOn(note, channel = 2) {
        if(!this.active) return;
        this.midiOutput.send("noteon", {
            note: note,
            velocity: 127,
            channel: channel
        });
    }
    ```

2. In `scripts/functions.js` you can extend the template class `myClass` with your own functions. Every function that should be callable via HTTP has to be added to the `ACTIONS` list, and it should return an HTTP status code.

    ```JS
    class myClass {
        /** Actions that may be called via /myFunctions?action=... */
        static ACTIONS = ['myFunction'];

        constructor(midiOutput) {
            this.midiOut = midiOutput;
        }
        /**
         *  @swagger
         *  /myFunctions?action=myFunction:
         *  get:
         *      tags: ["YourOwnClass"]
         *      summary: "Your own function"
         *      description: "Describe your own function"
         *      responses:
         *          200:
         *              description: Your own function has been executed
         */
        myFunction() {
            console.info('myClass: Your own function will be executed');
            this.midiOut.sendMidiNoteOn(10);
            return 200;
        }
    }
    ```

3. If you rename the class or want to add a new route, adjust `index.js`:

    ```JS
    app.get('/myFunctions', (req, res) => {
        handleAction(req, res, myFunctions, myClass.ACTIONS);
    });
    ```

If you now start the server, you can call your function via the URL

  ``` URL
  http://localhost:8010/myFunctions?action=*myAction*
  ```

The parameter `*myAction*` is the exact name of the function from the `ACTIONS` list.

With the JS-Doc style `@swagger` comments before each method, your functions are also listed in the [`api-docs`](http://localhost:8010/api-docs).

## Compiling

http2midi is compiled with [`@yao-pkg/pkg`](https://github.com/yao-pkg/pkg), which is installed as a dev dependency. Run:

```CMD
npm install
npm run build
```

The executable is created at `dist/http2midi.exe`.

### Releases

When a version tag is pushed (e.g. `git tag v1.5.0` and `git push origin v1.5.0`), a GitHub Action builds the exe and publishes a ZIP with the exe, the default config and the docs as a GitHub Release.

## Developer

<img src="https://avatars.githubusercontent.com/ScheerleJo" height="50px" title="Josia Scheerle" alt="Profile picture of the developer"/> | [`@ScheerleJo`](https://github.com/ScheerleJo)
