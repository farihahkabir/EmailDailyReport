var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

// Bring in models
const User = require('../models/User'); 

const { ensureAuthenticated } = require('../config/auth');
const { forwardAuthenticated } = require('../config/auth');


router.get ('/dash', ensureAuthenticated, function (request, response){
    response.render ('dash');
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

//Login Handle
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dash',
        failureRedirect: '/'
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;