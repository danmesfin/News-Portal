// imports
const express = require("express")
var session = require('express-session');
const expresslayouts = require("express-ejs-layouts")
const req = require("express/lib/request")
const res = require("express/lib/response")
const app =express()
var mysql = require('mysql2');
var bodyParser = require('body-parser');
var path = require('path');
const port = 3000

var con= mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '0419',
	database : 'nodelogin',

});
con.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected!");
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
    response.redirect('/h');
	//	response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

//static files
app.use(express.static('public'))
app.use(expresslayouts)
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// set views
app.set('views', './views')
app.set('view engine','ejs')
app.set('layout','./layout/main')

app.get('', (req,res) => {
  res.render('index');
  
		// Value to be inserted
		let userNamee = "Pratik";
		let userAddress = "My Address";
	  
		// Creating queries
		con.query('INSERT INTO gfg_table (name, address) VALUES (?, ?)', [userNamee, userAddress], (err, rows) => {
			if (err) throw err;
			console.log("Row inserted with id = "
				+ rows.insertId);
		});
	

})

app.get('/about', (req,res) => {
    res.render('about',{layout:'./layout/main'})
  
  })
  app.get('/login', (req,res) => {
    res.render('./admin/login',{layout:'./layout/admin'})
  
  })
  app.get('/h', (req,res) => {
    res.render('index')
  
  })
  // admin
  app.get('/admin', (req,res) => {
    res.render('./admin/adminland',{layout:'./layout/dashboard'})
  
  })
 

//listsen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}` ))