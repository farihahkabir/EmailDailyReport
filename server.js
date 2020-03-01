// get  express, nodemailer and body parser
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

    // Bring in models
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


    app.use('/', routes);

    //send report email
    app.post('/send-email', function (req, res) {
      let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'farihah.gt@gmail.com',
              pass: 'saltedcaramel1/4/97'
          }
      });
      let mailOptions = {
          from: '"Farihah Kabir" <farihah.gt@gmail.com>', // sender address
          to: 'monir@gigatechltd.com', // list of receivers
          subject: 'From ' +req.body.name + ', Date:' +req.body.date, // Subject line
        //   subject: 'Daily Report: Day ' +req.body.date,
          text: "Tasks Assigned:" + req.body.tasks + "Tasks Completed:" + req.body.completed + "Learnings:" + req.body.learnings, // plain text body
          html: "<h3>"+ "Tasks Assigned:" +"</h3>" + "<p>"+req.body.tasks + "</p>" + "<h3>"+"Tasks Completed:" +"</h3>" +"<p>" + req.body.completed + "</p>" + "<h3>"+"Learnings:" +"</h3>" +"<p>" + req.body.learnings + "</p>"
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('report');
          });
      });
      
      
      //send order email
      app.post('/place-order', function (req, res) {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'farihah.gt@gmail.com',
                pass: 'saltedcaramel1/4/97'
            }
        });
        let mailOptions = {
            from: '"Farihah Kabir" <farihah.gt@gmail.com>', // sender address
            to: 'nadahkabir@gmail.com', // list of receivers
            subject: req.body.personsName + ': Food Order for ' +req.body.orderDay,
            text: req.body.personsName + "orders food for:" + req.body.orderDay, 
            html: "<b>"+ req.body.personsName +"</b>" + " orders food for: "+ "<b>"+req.body.orderDay+"</b>"
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            
            console.log('Message %s sent: %s', info.messageId, info.response);
                res.render('menu');
            });
        });

        
      //run server on port 3000
          app.listen(port, function(){
            console.log('Server is running at port: ',port);
          });