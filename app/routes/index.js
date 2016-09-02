'use strict';

var LogicHandler = require(process.cwd() + '/app/controllers/logicHandler.server.js'); 

module.exports = function (router, db) {
	var logicHandler = new LogicHandler(db);

    router.get("/",function(req,res){
    	//home page with usage instructions
		res.sendFile(process.cwd() + '/public/index.html');
    });
    router.get("/api/imagesearch/:value",logicHandler.getImages);
    router.get("/latest/imagesearch",logicHandler.getSearches);
}
