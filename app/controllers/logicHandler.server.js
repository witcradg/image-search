'use strict';

var request = require('request');

var log = function (args) {
	var str = '';
		for (var i = 0; i < arguments.length; i++) {
			str += arguments[i] + ' ';    	
	}
	if (global.debug) {
		console.log(str);
	}
}

function logicHandler(db) {  
	var collection = db.collection('imagesearch');
	
	this.getImages = function(req, res) {
		log("getImages called");
		var searchString = req.params.value;
  		if (searchString == 'favicon.ico') {
  			log('skipping favicon');
  		} else {
			var pageOffset = req.query.offset || '0'; 
			var PAGE_SIZE = 10; //not variable in the requirements
			var page = Number(pageOffset);
	  		var uriBase = 'https://www.googleapis.com/customsearch/v1?googlehost=google.com&safe=medium&searchType=image';	
			//log('uriBase:', uriBase);

			var apikey = "AIzaSyCKizpBjh6D5VFlSZR_9rizUjM79INTytA";
			//log('apikey:', apikey);
			
			var credentials = '011155214332352662074:83scjoh6jle';
			//log('credentials:', credentials);

			//&fields=kind,items(title,characteristics/length)
			var fields = "items(title,link,snippet,image/contextLink)";

			var uri = `${uriBase}&key=${apikey}&fields=${fields}&cx=${credentials}&start=${PAGE_SIZE*page+1}&q=${searchString}`;
			console.log("uri:", uri);

			//request seems to take a string not an encoded uri
			request(uri, function (err, response, body) {
				if (err) { throw err; }
				
				if (response.statusCode == 200) {
					//TODO if count > 9 drop oldest before insert. Implies need to carry timestamp in document
					collection.find({}).sort({'dtm': 1}).toArray(function(err, items) {
						if (err) { throw err;}
						log("history count:",items.length);
						if (items.length > 9) { //arbitrary value for max number of "latest searches" history
							log('found collection count > 5. Deleting oldest record: ', JSON.stringify(items[0]));	
							var id = items[0]._id;
							collection.remove( { '_id': items[0]._id });
						}
					});

				}
				collection.insert( {'search': searchString, 'dtm': Date.now() }, function(err) {
						if (err) { log('error detected in insert'); throw err;}
				});
				var formatted = `<pre>${body}</pre>`;
				res.send(formatted);

			})
 		}
	},
	this.getSearches = function(req, res) {		
		log("getSearches called");
		collection.find().toArray(function(err, items) {
			if (err) throw err;
            console.log(items);
            var formatted = `<pre>${JSON.stringify(items,null,' ')}</pre>`;
            res.send(formatted);
		});
	}
}


module.exports = logicHandler;


