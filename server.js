// server.js
// where your node app starts
var moment = require('moment');
// init project
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
var Datastore = require('nedb'), 
    // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    db = new Datastore({ filename: '.data/users', autoload: true });
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
var users = [
]
//Moment stuff
moment.locale('de') 

//Future me, it's important: Use JSON.stringify() or String () (String is better) for printing objects



db.count({}, function (err, count) {
  console.log("There are " + count + " users in the database");
  if(err) console.log("There's a problem with the database: ", err);
  else if(count<=0){ // empty database so needs populating
    // default users inserted in the database
    db.insert(users, function (err, usersAdded) {
      if(err) console.log("There's a problem with the database: ", err);
      else if(usersAdded) console.log("Default users inserted in the database");
    });
  }
});


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/unternehmen", function (request, response) {
  response.sendFile(__dirname + '/views/unternehmen.html');
});

app.get("/rem", function (request, response) {
db.remove({}, { multi: true }, function (err, numRemoved) {
  console.log('OK')
});
response.send('Deleted everyone')
});


// This will send the user creation interface.
app.get("/neub", function (req, res) {
res.sendFile(__dirname + '/views/newuserb.html');
  });


// This will send the company creation interface.
app.get("/neuc", function (req, res) {
res.sendFile(__dirname + '/views/newcomp.html');
  });
//Create a new user and push it to the database
app.post("/new-buerger", function (req, res) {
  var Schueler = function() {
  this.Name = req.body.fname + ' ' +  req.body.lname;
  this.fname = req.body.fname
  this.lname = req.body.lname
  this.Class = req.body.klasse;
  this.Balance = 2500
  this.ID = req.body.code
  this.Type = "User"
  this.Group = 'Schüler'
  // Future additions down below:
  //this.Employed = Employed;
  //this.OwnsCompany = OwnsCompany;
  //this.WorksAt = WorksAt;
  }
  var newuser = new Schueler
  console.log(newuser);
  db.insert(newuser, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
});
  res.send('User created successfully')
  db.find({ fname: req.body.fname }, function (err, docs) {
console.log(docs)
});
  });


// This will send the user creation interface for tourists.q
app.get("/neuv", function (req, res) {
res.sendFile(__dirname + '/views/newuserv.html');
  });
//Create a new user and push it to the database
app.post("/new-visa", function (req, res) {
  var Visa = function() {
  this.Name = req.body.fname + ' ' +  req.body.lname;
  this.fname = req.body.fname
  this.lname = req.body.lname
  this.Balance = 1200
  this.ID = req.body.code
  this.Type = 'User'
  this.Group = 'Tourist'
  // Future additions down below:
  //this.Employed = Employed;
  //this.OwnsCompany = OwnsCompany;
  //this.WorksAt = WorksAt;
  }
  var newuser = new Visa
  console.log(newuser);
  db.insert(newuser, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
});
  res.send('User created successfully')
  db.find({ fname: req.body.fname }, function (err, docs) {
console.log(docs)
});
  });

//Create a new company and push it to the database
app.post("/new-comp", function (req, res) {
  var Firma = function() {
  this.Name = req.body.company;
  this.Founder = req.body.fullname
  this.FounderID = req.body.code
  this.UID = req.body.companycode
  this.Type = 'Company'
  this.CGroup = 'Test'
  // Future additions down below:
  //this.Employed = Employed;
  //this.OwnsCompany = OwnsCompany;
  //this.WorksAt = WorksAt;
  }
  var newcomp = new Firma
  console.log(newcomp)
  db.insert(newcomp, function (err, newDoc) { 
});
  res.send('Company created successfully')
  db.find({ UID: req.body.companycode }, function (err, docs) {
console.log(String(docs[0].Name))
});

  });



// This is used for checking in or out. I'll probably get a barcode scanner for this.
app.post("/old-buerger", function (req, response) {
  console.log(req.body);
  if (req.body.status == "checkin") {
    var statusInText = "betreten."
  } else if (req.body.status == "checkout") {
    var statusInText = "verlassen."
  }
  response.send('Erfolgreich den Staat ' + statusInText);
  db.find({ ID: req.body.code }, function (err, docs) {
    console.log(String(docs[0].Name) + ' hat den Staat um '+ moment().format('LT') + ' am ' + moment().format('LL') + ' erfolgreich ' + statusInText);
});
});

// For companies
app.post("/companylogin", function (req, res) {
  console.log(req.body);
  res.send('Erfolgreich eingeloggt');
});


var testProducts = [
  
]


// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log('Managment system online')
  console.log('Database OK')
  console.log('Ready')
  console.log('')
});
