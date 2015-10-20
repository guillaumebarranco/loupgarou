"use strict";

$(document).ready(function() {

	// CONSTANTS
	var app_url = 'http://localhost:2000';
	var _this = this;
	var socket = io.connect(app_url);

	// VARIABLES
	var currentState = 'day';

	var nb_players = 0;
	var composition = {};

	

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
				$('.roles').append('<li>'+_this.response[i].name+'</li>');
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

	function launchGame() {
		socket.emit('launch_game', {nb_players, composition});
	}

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
