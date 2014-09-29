var when = require('when');
var bt = require('./bustime');

bt.setBaseUrl('http://realtime.ridemcts.com/bustime/api/v2/');
bt.setApiKey('wMKThu9ym2LfYrNuv6FjVjh8v');

bt.gatherAllData().then(function(routes) {
    var stops = 0;
    for (var i=0;i<routes.length;i++) {
        stops += routes[i].stops.length;
    }
    console.log('Routes: ' + routes.length + ', Stops: ' + stops);
}).catch(function(e){
    console.log('Error: ' + e);
});
