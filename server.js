var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');

    var app = express();
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var port = 3000;

    app.get('/', function (req, res) {
      res.render('index');
    });

    app.post('/send-email', function (req, res) {
      let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'nadahkabir@gmail.com',
              pass: 'saltedcaramel1/4/97'
          }
      });
      let mailOptions = {
          from: '"Farihah Kabir" <nadahkabir@gmail.com>', // sender address
          to: 'farihah.gt@gmail.com', // list of receivers
          subject: 'Daily Report: Day ' +req.body.day, // Subject line
          text: "Tasks Assigned:" + req.body.tasks + "Tasks Completed:" + req.body.completed + "Learnings:" + req.body.learnings, // plain text body
          html: "<h3>"+ "Tasks Assigned:" +"</h3>" + "<p>"+req.body.tasks + "</p>" + "<h3>"+"Tasks Completed:" +"</h3>" +"<p>" + req.body.completed + "</p>" + "<h3>"+"Learnings:" +"</h3>" +"<p>" + req.body.learnings + "</p>"
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('index');
          });
      });
          app.listen(port, function(){
            console.log('Server is running at port: ',port);
          });