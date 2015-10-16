var express = require('express');
var app = express();
var port = 2000;
var path = require ('path');
var bodyParser = require('body-parser');

// app.use(express.static(path.join(__dirname + '.../public')));
app.use(express.static(__dirname + '/public'));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.set('/views', __dirname + 'views');



app.get('/', function(req, res) {
    res.render('template.ejs', {});
});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



var roles = require('./src/routes/roles');
app.use('/roles', roles);


var users = require('./src/routes/users');
app.use('/users', users);




var server = app.listen(port);






var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

	socket.on('buttonColor', function (text) {
	    socket.broadcast.emit('newText', text);
	});
});