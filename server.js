var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    mongo = require('mongodb'),
    bodyParser = require('body-parser');

    const expressLayouts = require('express-ejs-layouts');
    const mongoose = require('mongoose');
    const flash = require('connect-flash');
    const session = require('express-session');
    const passport = require('passport');
    const { forwardAuthenticated } = require('./config/auth');

    var app = express();

    //Bring models
    const Order = require('./models/Order');

    // Passport Config
    require('./config/passport')(passport);
    
    //get route files
    var routes = require('./routes/routes');


     // Express session middleware
     app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
        })
    );

    // Connect flash
    app.use(flash());
    
    // Global variables
    app.use(function(req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });


    //Connect to mongo
    mongoose.connect('mongodb://localhost:27017/login', { useUnifiedTopology: true, useNewUrlParser: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log('err'));

    //EJS
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({extended: false}));

    //set static route
    app.use(express.static('public'));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var port = 3000;


    //define home route
    app.get('/', forwardAuthenticated, function(request, response){
        response.render('home');
    });
   
    
    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());


    //access routes in route folder
    app.use('/', routes);

    
        
    //run server on port 3000
    app.listen(process.env.PORT || port , process.env.IP || 'localhost', function(){
        console.log('Server is running at port: ');
    });