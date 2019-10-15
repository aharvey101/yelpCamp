require('dotenv').config();

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	localStrategy = require('passport-local'),
	methodOverride = require('method-override');
(flash = require('connect-flash')), (Campground = require('./models/campground')), (Comment = require('./models/comment'));
(User = require('./models/user')), (seedDB = require('./seeds'));

//requiring routes
var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	authRoutes = require('./routes/index');

console.log(process.env.DATABASEURL), mongoose.connect(process.env.DATABASEURL);
//mongoose.connect('mongodb://localhost/yelp_camp_v4');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the database

app.locals.moment = require('moment');
//Passport Configuration
app.use(
	require('express-session')({
		secret: 'Once again rusty is a cute dog',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(commentRoutes);

app.get('/', function(req, res) {
	res.render('landing');
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('The YelpCamp Server Has Started!');
});
