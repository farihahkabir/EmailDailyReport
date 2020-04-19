var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var nodeMailer = require('nodemailer');

// Bring in models
const User = require('../models/User'); 
const Order = require('../models/Order'); 
const { ensureAuthenticated } = require('../config/auth');
const { forwardAuthenticated } = require('../config/auth');


//set routes
router.get ('/dash', ensureAuthenticated, function (request, response){
  //get username
  mongoose.model("User").find(function(err, users){
    if(err){
      response.send("Some error occured");
    }
    response.render('dash', {
        users : request.user.name
    });
  })
});

router.get ('/register', function (request, response){
    response.render ('register');
});

router.get ('/menu', ensureAuthenticated, function (request, response){
    response.render ('menu');
});

router.get ('/report', ensureAuthenticated, function (request, response){
    response.render ('report');
});

router.get('/history', function(req,res){
  //get order history from database
  mongoose.model("Order").find(function(err, orders){
    if(err){
      res.send("Some error occured");
    }
    res.render('history',{
      orders : orders
    });
  })
});


// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
      //validation passed
    User.findOne({ email: email })
    .then(user => {
      if (user) {
          //user exits
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        //hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hashed
            newUser.password = hash;
            //save user
            newUser.save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//send report email 
router.post('/send-email', function (req, res) {
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
    //   subject: 'From ' +req.body.name + ', Date:' +req.body.date, // Subject line
      subject: 'Daily Report: Day ' +req.body.date,
      text: "Tasks Assigned:" + req.body.tasks + "Tasks Completed:" + req.body.completed + "Learnings:" + req.body.learnings, // plain text body
      html: "<h3>"+ "Tasks Assigned:" +"</h3>" + "<p>"+req.body.tasks + "</p>" + "<h3>"+"Tasks Completed:" +"</h3>" +"<p>" + req.body.completed + "</p>" + "<h3>"+"Learnings:" +"</h3>" +"<p>" + req.body.learnings + "</p>",
      attachments: [
        {
          filename: req.body.file,
          path: req.body.path,
          contentType: 'application/pdf'
        },
      ] 
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
          res.render('report');
      });
  });


//send order email and add to database
router.post('/place-order', function (req, res) { 
  const {personsName, orderDay, orderDate} = req.body;
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
      const newOrder = new Order({
          personsName,
          orderDay,
          orderDate
        });

        //save order
        newOrder.save()
        .then(order => {
          console.log('Saved to db')
        })
        .catch(err => console.log(err));

      console.log('Message %s sent: %s', info.messageId, info.response);
      res.render('menu');
      });
  });



//Login Handle
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dash',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;