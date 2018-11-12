var express = require('express');
var path = require('path');
var session = require('express-session');
var catalogController = require('./controllers/catalogController.js');
var profileController = require('./controllers/profileController.js');
var siteNavigationController = require('./controllers/siteNavigationController.js');
var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/posterSwap1");



var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/resources', express.static('resources'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({secret: "max"}));

mongoose.connection.once('open', function(){
  console.log('Connectione made');
}).on('error', function(error){
  console.log('COnnection error, ', error);
});

catalogController.catalogController(app);
profileController.profileController(app);
siteNavigationController.siteNavigationController(app);

app.listen(8080, function () {
  console.log('App listening on port 8080!');
});

module.exports = app;
