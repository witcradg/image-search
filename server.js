'use strict';
if (process.argv[2] && process.argv[2].toLowerCase() === 'debug') {
    global.debug = true;
    console.log("debugging");
}

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongo = require('mongodb').MongoClient;

var app = express();
var router = express.Router();

//export MONGOLAB_URI="mongodb://xxxx:yyyyy@ds161175.mlab.com:61175/fcc-dgw"

var url = process.env.MONGOLAB_URI;

mongo.connect(url, function (err, db) {
    if (err) {
    	throw new Error('Database failed to connect!');
    } else {
    	console.log('MongoDB successfully connected on port 61175.');
    }
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));
    app.use("/",router);
    routes(router,db);
    
    app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
        console.log("server listening on port " + process.env.PORT + " at IP " + process.env.IP);
    });
});
