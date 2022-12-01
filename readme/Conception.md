# Conception for the Rework

Index.js for all webserver actions
midi.js for all sending and recieving midi signals
functions.js fpr all action triggering and handling stuff

## Basic Notes

- Rework for the entire structure
- module.js gets split up into multiple js files for more user customization and simpler oversight
- midi.js with its own midi tool instead of using external tools like "loopMidi" or physical ports
  
  - While testing this can be bypassed with loopmidi for now

- Rework for debug-helper.
  
  - switch to swagger
  - make a windows gui for more control and insights
  - simpler online tool for testing use
