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
		console.log("INFO: user", user.username, "has logged in.", user);
		return done(null, user);
	  });
    });
}));

passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  console.log("deserializeUser");
  db.getUser(username, function(err, user)
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


    app.get('/login', function (req, res, next) {
        return res.render('login');
    });

    app.post('/login', passport.authenticate('local', { successRedirect: '/queixinhas/dashboard',
                                              failureRedirect: '/',
                                              failureFlash: true }));
											  
	app.get('/register', function (req, res, next) {
		if(req.user.username) return res.redirect('/');
		return res.render('register');
	});
	
	app.post('/register', function (req, res, next) {
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
		db.newUser(user, function(err, user) {
			if(err) next('router');
			req.login(user, function(err){
				if(err) return res.redirect('/');
				return res.redirect('/queixinhas/dashboard');
			});
		});
	});

    app.get('/logout', function(req, res, next) {
      req.logout();
      res.redirect('/');
    });
}