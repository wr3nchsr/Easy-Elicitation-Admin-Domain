var express = require('express');
var app = express();
var session = require('express-session')    
var pug = require('pug');
app.set('view engine', 'pug');
var db= require('./databaseconnection.js');
var router = require('./routes/router');
app.use('/router',router); 

app.set('views', __dirname + '/View');

app.get('/', function (req, res) {
   res.sendFile('LoginAdmin.html',{root: __dirname });
   app.use('/css',express.static(__dirname +'/css'));
   app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", 'http://localhost:8081'); // update to match the domain you will make the request from

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
})
app.get('/newadmin',function(req,res){
   res.render('addAdmin');
})
app.get('/newcompanyadmin',function(req,res){
   res.render('addcompanyadmin');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port   
   console.log("Example app listening at http://:%s", port)
})



