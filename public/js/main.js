"use strict";

$(document).ready(function() {

	// CONSTANTS
	var app_url = 'http://localhost:2000';
	var _this = this;
	var socket = io.connect(app_url);

	// VARIABLES
	var currentState = 'day';

	var players = [];
	players[0] = 'koko';
	players[1] = 'Gear';

	var composition = [];
	var roles = [];

	Array.prototype.unset = function(val){
	    var index = this.indexOf(val)
	    if(index > -1){
	        this.splice(index,1)
	    }
	}

	

	/*
	*	USERS
	*/

	$('.getUsers').on('click', function() {

		makeAjax('GET', app_url+"/users/", '', function() {

			console.log(_this.response);

			for (var i = 0; i < _this.response.length; i++) {
				$('.users').append('<li>'+_this.response[i].username+'</li>');
			}
		});
	});

	$('.addUser').on('click', function() {

		var options = {
			data: {
				username: 'Gear', 
				password: 'mdp',
				level: 1,
				nb_games: 0,
				nb_win: 0,
				nb_lost: 0,
				nb_draw: 0
			}
		};

		makeAjax('POST', app_url+"/users/insert", options, function() {

			$('ul').empty();

			for (var i = 0; i < _this.response.length; i++) {
				$('ul').append('<li>'+_this.response[i].username+'</li>');
			}
		});

	});

	/*
	*	ROLES
	*/

	//$('.getRoles').on('click', function() {

		makeAjax('GET', app_url+"/roles/", '', function() {

			$('.roles').empty();
			for (var i = 0; i < _this.response.length; i++) {
				$('.roles').append('<li><img width="20" src="img/roles/'+_this.response[i].picture+'.jpg" /><span>'+_this.response[i].name+'</span></li>');
			}
		});
	//});

	/*
	*	CHAT
	*/

	$('.sendChat').on('click', function() {
		var content = {};
		content.content = $('.textChat').val();
		content.username = $('.current_user').text();

		if(content != '') {
			socket.emit('sendText', {content: content});
			$('.chat').append('<div><b>'+content.username+'</b>: '+content.content+'</div>');
			$('.textChat').val('');
		}
	});

	socket.on('newText', function (text) {
		console.log(text);
		$('.chat').append('<div><b>'+text.content.username+'</b>: '+text.content.content+'</div>');
	});




	var user_id_admin = true;
	var night = true;





	// setTimeout(function() {
	// 	if(user_id_admin && night) socket.emit('night');
	// },5000);

	socket.on('wake_up_lg', function (text) {
		wake_up_lg();
	});

	socket.on('wake_up_vovo', function (text) {
		wake_up_vovo();
	});

	function wake_up_vovo() {
		$('.chat').append('<div><em>La voyante va pouvoir espionner un joueur de son choix.</em></div>');
	}

	function wake_up_lg() {
		$('.chat').append('<div><em>Les loups garous vont pouvoir se réveiller.</em></div>');
	}

	function wake_up_soso() {
		$('.chat').append('<div><em>La sorcière va pouvoir utiliser ses potions.<em></div>');
	}

	function wake_up_corbac() {
		$('.chat').append("<div><em>Le corbeau va pouvoir désigner quelqu'un.<em></div>");
	}

	function wake_up_lgb() {
		$('.chat').append("<div><em>Le Loup-Garou blanc va pouvoir assassiner un autre loup-garou.<em></div>");
	}

	function wake_up_salva() {
		$('.chat').append("<div><em>Le Salvateur va pouvoir protéger quelqu'un.<em></div>");
	}

	/*
	*	GAME
	*/

	$('.launchGame').on('click', function() {

		// console.log('nb_players', players);
		// console.log('roles', roles.length);

		if(players.length === roles.length) {
			launchGame();
		} else {
			alert('Pas le même nombre de players et de roles choisis');
		}
	});

	function rand(min, max) {
		var the_random = Math.floor(Math.random() * (max - min + 1)) + min;
		return the_random;
	}

	var tab_random = [];

	function launchGame() {
		$('.launchGame').hide();

		for (var i = 0; i < players.length; i++) {

			console.log('tab_random', tab_random);

			var get_rand = rand(0, (players.length - 1));

			if(tab_random.indexOf(get_rand) != -1) {
				while(tab_random.indexOf(get_rand) != -1) {
					get_rand = rand(0, (players.length - 1));
				}
			}

			console.log('get_rand', get_rand);

			tab_random.push(get_rand);

			composition[i] = [];
			composition[i].player = players[get_rand];
			composition[i].role = roles[i];
		}

		console.log('composition', composition);

		socket.emit('launch_game', {composition});
	}

	$(document).on('click', '.roles li', function() {

		if($(this).hasClass('composed')) {

			$(this).removeClass('composed');
			roles.unset($(this).find('span').text());

		} else {

			$(this).addClass('composed');
			roles.push($(this).find('span').text());
		}
	});





	function getRooms() {
		makeAjax('GET', app_url+"/games/", '', function() {
			$('.rooms').empty();

			var koko;
			var name;
			var link;

			for (var i = 0; i < _this.response.length; i++) {
				name = _this.response[i].name;
				link = "http://localhost:2000/play?="+_this.response[i].uniqd;
				koko = `
					<li>
						<a href="${link}">${name}</a>
					</li>
				`;

				$('.rooms').append(koko);
			}
		});
	}

	getRooms();

	$('form.create').hide();

	$('.createRoom').on('click', function() {
		$(this).hide();
		$('form.create').show();
	});

	$('.hide_create').on('click', function(e) {
		e.preventDefault();
		$(this).parent().hide();
		$('.createRoom').show();
	});

	/*
	*	GENERAL FUNCTIONS
	*/

	function makeAjax(type, url, data, callback) {

		$.ajax({
			type : type,
			url : url,
			data : data,
			success: function(response_get) {
				// La variable globale de reponse est remplacée à chaque requête AJAX
				_this.response = response_get;
				callback();
			},
			error: function(){
				console.log('error', url);
	        }
		});
	}

});
