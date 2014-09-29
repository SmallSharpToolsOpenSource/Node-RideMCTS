Node.js for RideMCTS 
====================

Implementation of the RideMCTS real-time API for bus arrival times using Node.js.

Replace API-KEY with actual API key. Get your own developer key at the link below.

http://realtime.ridemcts.com/bustime/newDeveloper.jsp

Installation
============

 * Install Node.js
 * Run `npm install` in the same folder as package.json

Running
=======

Running `index.js` can be done with `run.sh` or `debug.sh` which would need the API-Key changed to a valid key. Shell scripts starting with "my" will be ignored to allow for setting they key without being added to public source control.

Testing
=======

Using Node Inspector to debug `index.js` and `sample.js` using the `node-debug` command which will launch the debugger tools in your web browsing allowing you to set breakpoints and watch variables. Install Node Inspector with the following command. Node Inspector works best in Chrome but is mostly usable in Safari but it is not advised.

`npm install -g node-inspector`

Dependencies
============

These scripts use the `when` and `rest` modules from `npm`.

