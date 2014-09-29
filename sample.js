var when = require('when');
var bt = require('./bustime');

var p1 = when.promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('one');
    }, 50);
});

var p2 = when.promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('two');
    }, 100);
});

var p3 = when.promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('three');
    }, 150);
});

var p4 = when.promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('four');
    }, 200);
});

var promises = [p1, p2, p3, p4];
var promise = bt.waitForPromises(promises);

// test wait function
promise.then(function(results) {
    console.log(results.join(', '));
    
    // test parsing bus-time timestamp for predictions
    console.log(bt.parseETA('20140927 09:30'));
    console.log(bt.parseETA('20140927 14:30'));
    
    // test qs function
    console.log('Query String: ' + bt.qs({'one' : 1, 'two' : 2, 'three' : 3, 'four' : 4}));
});
