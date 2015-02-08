var express = require('express');
var router = express.Router();
var db = require('../dbaccess');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.user);	
	//check user authentication
	//get list of top/most recent entries for unauthenticated users
	//else get list of entries, add paging
	console.log('no user');
	db.getQueixinhas(1, function(err, list){
		if(err) return res.render('index');
		return res.render('index', { queixas: list });
	});
	
});

module.exports = router;
