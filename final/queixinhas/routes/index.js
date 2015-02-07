var express = require('express');
var router = express.Router();
var db = requier('dbaccess');

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user) return res.redirect('/queixinhas');
	//check user authentication
	//get list of top/most recent entries for unauthenticated users
	//else get list of entries, add paging
	db.getQueixinhas(1, function(err, list){
		if(err) res.render('index');
		res.render('index', { queixas: list });
	});
	
});

module.exports = router;
