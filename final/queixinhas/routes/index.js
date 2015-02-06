var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//check user authentication
	//get list of top/most recent entries for unauthenticated users
	//else get list of entries, add paging
	res.render('index', { title: 'Express' });
});

module.exports = router;
