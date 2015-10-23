var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require ('path');

var usersController = require('./src/controllers/usersController')();
var gamesController = require('./src/controllers/gamesController')();

var port = 2000;
var app = express();

var sess;

// Fonction pour vérifier qu'un utilisateur est loggé pour le rediriger
function requireLogin (req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Fonction pour vider une entrée d'un tableau tout en la supprimant réellement
Array.prototype.unset = function(val){
    var index = this.indexOf(val)
    if(index > -1){
        this.splice(index,1)
    }
}





// app.use(express.static(path.join(__dirname + '.../public')));
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'ssshhhhh',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  sess = req.session;
  req.session.cookie.expires = false;
  next();
});

app.post('/register', function(req,res){

	var options = {
		username: req.body.username, 
		password: req.body.password,
		level: 1,
		nb_games: 0,
		nb_win: 0,
		nb_lost: 0,
		nb_draw: 0
	};

	usersController.insertUser(options, function(response) {
        sess.username = req.body.username;
    	res.redirect('/');
    });
});

app.post('/login', function(req,res){

	usersController.checkUser(req.body.username, req.body.password, function(response) {

		if(response.check == 'ok') {
			sess.username = req.body.username;
    		res.redirect('/');
		} else {
			res.render('login.ejs', {error: response.check});
		}
        
    });
});

app.post('/disconnect', function(req,res){
    req.session.destroy();
    res.redirect('/');
});

app.post('/createRoom', function(req,res){

	var game = {
		name: req.body.name,
		author: 'Gear',
		is_playing: 0,
		is_finished: 0,
		players: 'Gear;',
		has_password: req.body.has_password
	};

	game.password = (parseInt(req.body.has_password) === 1) ? req.body.password : null;

	gamesController.createGame(game, function(response) {
    	res.redirect('/game?id='+response.id);
    });

});


app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('/views', __dirname + 'views');



app.get('/', [requireLogin], function(req, res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('home.ejs', {});
});

app.get('/play', [requireLogin], function(req, res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('play.ejs', {username: sess.username});
});

app.get('/account', [requireLogin], function(req, res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('account.ejs', {username: sess.username});
});

app.get('/login', function(req, res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('login.ejs');
});



var roles = require('./src/routes/roles');
app.use('/roles', roles);
var users = require('./src/routes/users');
app.use('/users', users);
var games = require('./src/routes/games');
app.use('/games', games);


// Gestion erreurs 404
app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!');
});

var server = app.listen(port);


/*
*	SOCKET.IO
*/

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

	socket.on('sendText', function (content) {
	    socket.broadcast.emit('newText', content);
	});

	socket.on('launchGame', function(composition) {
		socket.emit('yourRole', composition);
		socket.broadcast.emit('yourRole', composition);
	});

	socket.on('night', function() {
		socket.broadcast.emit('wake_up_lg');
		socket.emit('wake_up_lg');
	});
	
});