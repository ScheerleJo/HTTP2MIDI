# HTTP2MIDI

This application uses a Node.js Webserver, which handles basic conversion from an HTTP-Request to a MIDI signal.
The MIDI signal controls the Recording DAW (Digital Audio Workstation), in this case [Presonus' Studio One](https://www.presonus.com/products/Studio-One) on Midi-Channel 1. In Addition to that, there is the control for "Presenter" by [WorshipTools](https://www.worshiptools.com/en-us) on Midi-Channel 2.

The tool is also very customizable with the new rework in Version v1.4. More on that [here](#your-own-customization)

## Our Usecase

The basic idea is to press a button on an Elgato Streamdeck running [Companion](https://github.com/bitfocus/companion). It sends an HTTP-Request to the computer running Studio One and Presenter for audio recording and visuals. There the MIDI signal gets created and input into the programs.

In our case, the MIDI signal gets sent through an audio interface that supports midi. That allows us to create and get the MIDI commands on one Laptop via hardware and no additional software.
However, it would be smarter to use a MIDI-Loopback adapter like [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) from Tobias Erichson.
In a future version of this software, I want to eliminate the need for separate soft- or hardware by creating my own in software MIDI-Loopback.

! The attribute "original Name" is just for me, so I dont have to look up the original Name of our local MIDI-Interface :D

## How it works

The already mentioned concept is that the Webserver gets an HTTP-Request which you can find in the [Command-list](./command_list.md).

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

For your use, you have to edit the parameters of the server_config.json config-file. That is for several reasons:

1. To suit your environment
2. To test/debug, or
3. even upgrade the software.

If you use the software and have ideas to upgrade it, please let me know. This applies if you upgrade the software on your own, too.

### Swagger

If you want to test single functions, you call the `http://localhost:8010/api-docs` which is the integrated swagger-UI. There you have all the functions listed and can check each indivudial one.

## Installation

! Warning!

You are in need for a [Python Version](https://www.python.org/downloads/). You have to install python before installing your node packages.

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

Since version 1.4, http2midi can be easily configured and extended to cover your use case.

Depending on your requirements, 3 steps are necessary.

1. this step can possibly be skipped if you only want to send notes and CC signals via midi. Otherwise you have to add another function in the scripts folder in the midi.js file in the MidiOutput class with the desired Midi signal type. You can find the documentation of the package [here](https://www.npmjs.com/package/easymidi).
  
    ```JS
      // This is a sample for a function in the midi.js to send a midi note
      sendMidiNoteOn(note, channel = 2) {
        this.midiOutput.send("noteon", {
          note: note,
          value: 127,
          channel: channel
        });
      }
    ```

2. in functions.js you can now add the template class “YourOwnClass” with your own required functions.  You can also rename it. But be careful that you also have to change this name in index.js in step 3.

    ```JS
    class YourOwnClass {
      constructor(midiOutput) {
          this.midiOut = midiOutput;
      }
      /**
       *  @swagger
      *  /yourOwnClass?action=yourOwnFunction:
      * get:
      *     tags: ["YourOwnClass"]
      *    summary: "Your own function"
      *   description: "Describe your own function"
      * responses:
      *    200:
      *     description: Your own function has been executed
      *   404:
      *    description: Error, because something went wrong
      */
      yourOwnFunction() {
          // Implement your own function here
          // you Can also copy this function as a template for your own functions
          console.info('YourOwnClass: Your own function will be executed'); 
      }
    }
    ```

    Once you have created all the required functions, step 3 follows.

3. Finally, you may need to customize the index.js file. If you have changed the name of the classes, you must also do this here. Otherwise, you can also make adjustments here if you want more than just the function call to be executed for each request.

    ```JS
      // Your own branch for custom functions
      app.get('/yourOwnFunction', (req, res) => {
          // Add your own function here
          res.json(yourOwnFunction[req.query.action]);
      });
    ```

If you now start the Node.js server, you can call the respective function via the URL

  ``` URL
  http://localhost:8010/myFunctions?action=*myAction*
  ```

The parameter `*myAction*` is the exact name of the function that you have created from your previously defined methods in functions.js.

For Debugging you can also write the JS-Doc style Comments before each method in your Class. That way, when you call the [`api-docs`](http://localhost:8010/api-docs) you have all your functions listed and can check each indivudial one.

## Compiling

You can compile http2midi with `pkg` from `yao-pkg`. To use this, simply run the command:

```CMD
  npm install -g @yao-pkg/pkg
```

After Installing you can run the following command, that compiles the server and creates a executable.

```CMD
  npm run build
```

!Important! It is crucial, that the `http2midi.exe` stays in the folder, since the configuration uses a dynamic path to read the `config.json`.

## Developer

<img src="https://avatars.githubusercontent.com/ScheerleJo" height="50px" title="Josia Scheerle" alt="Profile picture of the developer"/> | [`@ScheerleJo`](https://github.com/ScheerleJo)
