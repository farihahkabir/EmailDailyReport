// get  express, nodemailer and body parser
var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    mongo = require('mongodb'),
    bodyParser = require('body-parser');

    var db_url = "mongodb+srv://farihah:farihah@cluster0-0pns7.mongodb.net/test?retryWrites=true&w=majority"; 

    var mongoose = require("mongoose");

    mongoose.connect(db_url, { useNewUrlParser: true });
    mongoose.connection.on('error', function(err){
    // console.log(err);
    console.log('Could not connect to mongodb');
    })

    // const mongoose = require('mongoose');

    //Configure database
    // const db = require('./config/keys').MongoURI;

    //Connect to mongo
    // mongoose.connect(db, { useNewUrlParser: true })
    //     .then(() => console.log('MongoDB connected'))
    //     .catch(err => console.log('err'));

    var app = express();
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var port = 3000;

    //define routes
    app.get('/', function (req, res) {
      res.render('home');
    });

    app.get ('/dash', function (request, response){
        response.render ('dash');
    });

    app.get ('/menu', function (request, response){
        response.render ('menu');
    });

    app.get ('/report', function (request, response){
        response.render ('report');
    });

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
        //   subject: 'From ' +req.body.email + ', Date:' +req.body.date, // Subject line
          subject: 'Daily Report: Day ' +req.body.date,
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
          //   subject: 'From ' +req.body.email + ', Date:' +req.body.date, // Subject line
            subject: 'Food Order for ' +req.body.orderDay,
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