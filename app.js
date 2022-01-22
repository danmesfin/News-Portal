// imports
const express = require("express")
var session = require('express-session');
const expresslayouts = require("express-ejs-layouts")
const req = require("express/lib/request")
const res = require("express/lib/response")
const app =express()
const multer = require('multer')
var bodyParser = require('body-parser');
var path = require('path');
const { title } = require("process");
const port = 3000
var con =require('./njdb/db/connector');
const truncate = require('truncate');
// the indexController
const indexController = require('./controllers/index');

// Routers
let router = require('./routes/index');


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
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

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());



app.use('/', router) // index router {index, login, register pages}


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
//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/img/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            console.log(file);
	}
})
 
var upload = multer({
    storage: storage
});

app.post('/createpost', upload.single('image'),function(request, response) {
	if (!request.file) {
        console.log("No file upload");
    } else {
	var contents = request.body.content;
	var title = request.body.title;
	var authorid = request.body.author;
	var topicid = request.body.topicid;
	var imgsrc = 'http://127.0.0.1:3000/img/' + request.file.filename;
    console.log('vlaues:',topicid, title,authorid,contents);
	
	if (contents) {
		response.send('content here !');
		// Creating queries
		con.query('INSERT INTO post (topicid,title,content,author,file_src) VALUES (?,?,?,?,?)', [topicid,title,contents,authorid,[imgsrc]], (err, rows) => {
			if (err) throw err;
			console.log("Row inserted with id = "
				+ rows.insertId);
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	} }
});
app.post('/update/:id', upload.single('image'),function(request, response) {
	if (!request.file) {
        console.log("No file upload");
    } else {
	var contents = request.body.content;
	var title = request.body.title;
	var authorid = request.body.author;
	var topicid = request.body.topicid;
	var imgsrc = 'http://127.0.0.1:3000/img/' + request.file.filename;
    console.log('vlaues:',topicid, title,authorid,contents);
	
	if (contents) {
		response.send('content here !');
		// Creating queries
		con.query('UPDATE post SET topicid = ?,title = ?,content = ?,author = ?,file_src = ? WHERE POSTID = ?', [topicid,title,contents,authorid,[imgsrc],request.params.id], (err, rows) => {
			if (err) throw err;
			console.log("Row inserted with id = "
				+ rows.insertId);
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	} }
});



//home request
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
    response.redirect('/h');
	//	response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.get('', (req,res) => {
 
  con.query(
	'SELECT * FROM post',
	(error, results) => {
		res.render('index', {post: results});
		//res.render('./admin/adminland', {post: results});
	}
);
});

app.get('/about', (req,res) => {
    res.render('about',{layout:'./layout/main'})
  
  });
  app.get('/login', (req,res) => {
    res.render('./admin/login',{layout:'./layout/admin'})
  
  });
  app.get('/h', (req,res) => {
    res.render('index')
  
  });
  // admin fetch all posts
  app.get('/admin', (req,res) => {

	con.query(
        'SELECT * FROM post',
        (error, results) => {
            res.render('./admin/adminland', {post: results, layout:'./layout/dashboard'});
			
        }
    );

  }) ;
 
/*admin edit post
app.get('/edit/:id', (req,res) => {
	
	con.query(
		'SELECT * FROM post WHERE postid = ?',
		[req.params.id],
		(error, results) => {
			res.render('admin/post/editpost', {post: results[0], verified: req.session.loggedin});
		}
	);

	
  }) ;
  */

// admin delete post
app.get('/delete/:id', (req,res) => {
	if (1==1) {
		con.query(
			'DELETE FROM post WHERE postid = ?',
			[req.params.id],
			(error, results) => {
				res.redirect('/admin');
			}
		);
	} else {
		res.send('something went wrong !');
	}
	
  }) ;

  //admin create new post
  app.get('/newpost', (req,res) => {
    res.render('./admin/post/createpost',{layout:'./layout/dashboard'})
  
  });
 
 

//listsen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}` ));