var when = require('when');
var bt = require('./bustime');

// Use your own developer key
// http://realtime.ridemcts.com/bustime/newDeveloper.jsp

bt.processArguments();
bt.setBaseUrl('http://realtime.ridemcts.com/bustime/api/v2/');

bt.loadData().then(function(data) {
    console.log(Object.keys(data.routes).length + ' routes');
    console.log(Object.keys(data.stops).length + ' stops');
}).catch(function(e){
    console.log('Error: ' + e);
});
