var when = require('when');
var bt = require('./bustime');

bt.setBaseUrl('http://realtime.ridemcts.com/bustime/api/v2/');

// Replace with your own developer key
// http://realtime.ridemcts.com/bustime/newDeveloper.jsp
bt.setApiKey('API-KEY');

bt.gatherAllData().then(function(routes) {
    var stops = 0;
    for (var i=0;i<routes.length;i++) {
        stops += routes[i].stops.length;
    }
    console.log('Routes: ' + routes.length + ', Stops: ' + stops);
}).catch(function(e){
    console.log('Error: ' + e);
});
