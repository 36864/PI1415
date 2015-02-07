var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./dbaccess');
var pass = require('pwd');

passport.use(new LocalStrategy(function(username, password, done){
    db.getUser(username, function(err, user) {
      if(err) return done(err);
      // TODO: Check password
	  pass.hash(password, user.salt, function(err, hash){
		if(err || hash !== user.hash) return done(null, false);
		console.log("INFO: user", user.id, "has logged in.", user);
		return done(null, user);
	  });
    });
}));

passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializeUser");
  db.getUser(id, function(err, user)
  {
    if(err) return done(err);

    user.isAuthenticated = true;	

    return done(null, user);
  });
});


module.exports = function(app)
{
    app.use(function(req, res, next) {
      req.user = req.user || new db.user();
      console.log('USER ' + req.user);
      next();
    });


    app.get('/login', function (req, res) {
        return res.render('auth/login');
    });

    app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                              failureRedirect: '/login',
                                              failureFlash: true }));
											  
	app.get('/register', function (req, res) {
		if(req.user) return res.redirect('/');
		return res.render('atuh/register');
	});
	
	app.post('/register', function (req, res) {
		if(req.user) return res.redirect('/');
		if(req.body.username === '' || req.body.password === '' || req.body.email === '') {
			res.flash('Please fill out all fields');
			return res.render('/register');
		}
		pass.hash(req.body.password, function(err, salt, hash)  {
			var user = new user()
			user.salt = salt;
			user.hash = hash;
		});
		db.User.createNew(user, function(err, user) {
			if(err) next('router');
			return res.redirect('/');
		});
	});

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });
}