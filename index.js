var when = require('when');
var bt = require('./bustime');
var fs = require('fs');

// Use your own developer key
// http://realtime.ridemcts.com/bustime/newDeveloper.jsp

bt.processArguments();
bt.setBaseUrl('http://realtime.ridemcts.com/bustime/api/v2/');

bt.gatherAllData().then(function(data) {
    console.log('Found ' + Object.keys(data.routes).length + ' routes.');
    console.log('Found ' + Object.keys(data.stops).length + ' stops.');
    
    // write the data out to a file to reuse while the data is still fresh (lastUpdated)
    var filename = './data.json';
    fs.writeFile(filename, JSON.stringify(data, null, 4), function(err) {
        if (err) {
            console.log('Error writing out JSON data: ' + err);
        }
        else {
            console.log('Saved JSON data to ' + filename);
        }
    });
}).catch(function(e){
    console.log('Error: ' + e);
});
