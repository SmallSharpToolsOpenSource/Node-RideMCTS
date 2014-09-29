(function () {
    
    var when = require('when');
    var rest = require('rest');
    
//// Utility Methods ////
    
    var qs = function(params) {
        var pairs = [];
        var keys = Object.keys(params);
        for (var i=0;i<keys.length;i++) {
            var key = keys[i];
            pairs.push(encodeURI(key) + '=' + encodeURI(params[key]));
        }
        
        return '?' + pairs.join('&');
    };
    
    // allows promises to be passed in as an array
    var waitForPromises = function(promises) {
        return when.join.apply(this, promises);
    };
    
    var fetchBusTimeResponse = function(url, params) {
        url = url + qs(params);
        //console.log('url: ' + url);
        return when.promise(function(resolve, reject) {
            rest(url).then(function(response) {
                var json = JSON.parse(response.entity);
                resolve(json['bustime-response']);
            }).catch(function(e) {
                console.log('Error: ' + e);
            });
        });
    };
    
    var parseETA = function(timestamp) {
        // timestamp : "20140927 14:30"
        if (timestamp.length === 14) {
            var year = parseInt(timestamp.substring(0, 4), 10);
            var month = parseInt(timestamp.substring(4, 6), 10);
            var day = parseInt(timestamp.substring(6, 8), 10);
            var hour = parseInt(timestamp.substring(9, 11), 10);
            var minute = parseInt(timestamp.substring(12, 14), 10);
            
            return new Date(year, month - 1, day, hour, minute, 0, 0);
        }
        else {
            return null;
        }
    };
    
    exports.qs = qs;
    exports.waitForPromises = waitForPromises;
    exports.parseETA = parseETA;
    
//// API Configuration ////
    
    var baseUrl = '';
    var apiKey = '';
    
    var setBaseUrl = function(url) {
        baseUrl = url;
    };
    
    var setApiKey = function(key) {
        apiKey = key;
    };
    
    exports.setBaseUrl = setBaseUrl;
    exports.setApiKey = setApiKey;
    
//// API Calls ////
    
    var fetchRoutes = function() {
        var url = baseUrl + 'getroutes';
        var params = {'key' : apiKey, 'format' : 'json'};
        return fetchBusTimeResponse(url, params).then(function(response) {
            var routes = response.routes;
            return when.promise(function(resolve, reject) {
                var myRoutes = [];

                for (var i=0;i<routes.length;i++) {
                    var route = routes[i];
                    myRoutes.push({'id' : route.rt, 'name' : route.rtnm, 'color' : route.rtclr});
                }
                resolve(myRoutes);
            });
        });
    };
    
    var fetchDirections = function(route) {
        var url = baseUrl + 'getdirections';
        var params = {'key' : apiKey, 'format' : 'json', 'rt' : route.id};
        
        return fetchBusTimeResponse(url, params).then(function(response) {
            return when.promise(function(resolve, reject) {
                var directions = [];
                for (var j=0;j<response.directions.length;j++) {
                    directions.push(response.directions[j].dir);
                }
                route.directions = directions;
                resolve(route);
            });
        });
    };
    
    var fetchStops = function(route, direction) {
        var url = baseUrl + 'getstops';
        var params = {'key' : apiKey, 'format' : 'json', 'rt' : route.id, 'dir' : direction};
        
        return fetchBusTimeResponse(url, params).then(function(response) {
            return when.promise(function(resolve, reject) {
                var stops = [];
                for (var i=0;i<response.stops.length;i++) {
                    var stop = response.stops[i];
                    var myStop =  { 'id' : stop.stpid, 'name' : stop.stpnm, 'latitude' : stop.lat, 'longitude' : stop.lon};
                    stops.push({'route' : route, 'direction' : direction, 'stop' : myStop});
                }
                route.stops = stops;
                resolve(route);
            });
        });
    };
    
    var fetchPredictions = function(route, direction, stop) {
        var url = baseUrl + 'getpredictions';
        var params = {'key' : apiKey, 'format' : 'json', 'rt' : route.id, 'dir' : direction, 'stpid' : stop.id};
        
        return fetchBusTimeResponse(url, params).then(function(response) {
            return when.promise(function(resolve, reject) {
                var predictions = [];
                for (var i=0;i<response.prd.length;i++) {
                    var eta = parseETA(response.prd[i].prdtm);
                    var myPrediction = {'eta' : eta, isoDateString : eta !== null ? eta.toISOString() : ''};
                    predictions.push(myPrediction);
                }
                resolve(predictions);
            });
        });
    };
    
    exports.fetchPredictions = fetchPredictions;
    
/// Loading Routines ////
    
    var gatherDirections = function(routes) {
        return fetchRoutes().then(function(routes) {
            var promises = [];
            for (var i=0;i<routes.length;i++) {
                var route = routes[i];

                // assemble the directions for each route
                var promise = fetchDirections(route);
                promises.push(promise);
            }

            return waitForPromises(promises);
        });
    };

    var gatherStops = function(routes) {
        var promises = [];
        for (var i=0;i<routes.length;i++) {
            var route = routes[i];
            if (!route.directions) {
                return when.reject('Directions not defined for route');
            }
            else {
                for (var j=0;j<route.directions.length;j++) {
                    var direction = route.directions[j];
                    var promise = fetchStops(route, direction);
                    promises.push(promise);
                }
            }
        }

        return waitForPromises(promises);
    };
    
    var gatherAllData = function() {
        return fetchRoutes().then(gatherDirections).then(gatherStops);
    };
    
    exports.gatherAllData = gatherAllData;
    
}());
