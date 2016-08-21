'use strict';

var log = function (args) {
	var str = '';
		for (var i = 0; i < arguments.length; i++) {
			str += arguments[i] + ' ';    	

	}
	if (process.env.DEBUG_LOGGING == "true") {
		console.log(str);
	}
}

function logicHandler(db) {  
	var urls = db.collection('urls');
	
	this.getImages = function(req, res) {
		log("getUrl called");
		var value = req.params.value;
  		if (value == 'favicon.ico') {
  			log('skipping favicon');
  		} else {
	  		log("value:",value);
			log("JSON value:",JSON.stringify(value));
	
	  		urls.findOne( {'short_url': value }, { '_id': false }, function(err, record) {
	  			log("findOne result:",JSON.stringify(record));
				if (err) { throw err; }
				if (record) {
					log("record.original_url:", record.original_url);
					res.redirect(record.original_url);		
					res.end();//not required when using res.send, not sure about res.redirect				
				} else {
					res.send("error: " + value + " This url is not in the database.");
				}
			});
  		}
	},
	
	/**
	 * remove this if not needed
	 */
	this.processSubmittedUrl = function(req, res, next) {
	    log("processSubmittedUrl req.url:", req.url);
	    next(); 
	}
}

var createUrl = function(originalUrl, urls, callback) {
	log('createUrl originalUrl', originalUrl);
	urls.count({}, function (err, count) {
		if (err) {
			throw err;
		}
		var shortUrl = (1000 + count + 1).toString();//simplify lookup
    	log("shortUrl:", shortUrl);
    	//could be improved with a lookup on the original to return any existing document pointing at the same original
		//would be safer with a unique index on short_url to prevent simutaneous submissions returning the same count
		urls.insert( {'original_url': originalUrl, 'short_url': shortUrl }, function(err) {
			if (err) { log('error detected in insert'); }
			callback(err, shortUrl);
		});
	});
}


module.exports = logicHandler;


