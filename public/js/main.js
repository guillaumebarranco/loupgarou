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

			for (var i = 0; i < _this.response.length; i++) {
				$('ul').empty().append('<li>'+_this.response[i].username+'</li>');
			}
		});

	});

	/*
	*	ROLES
	*/

	$('.getRoles').on('click', function() {

		makeAjax('GET', app_url+"/roles/", '', function() {

			for (var i = 0; i < _this.response.length; i++) {
				$('.roles').empty().append('<li>'+_this.response[i].name+'</li>');
			}
		});
	});

	/*
	*	CHAT
	*/

	$('.sendChat').on('click', function() {
		var content = $('.textChat').val();
		if(content != '') socket.emit('buttonColor', {content: content});
	});

	socket.on('newText', function (text) {
		$('.chat').append('<div>'+text.content+'</div>');
	});

	var user_id_admin = true;
	var night = true;

	socket.on('newTextYours', function (text) {
		$('.chat').append('<div><b>'+text.content+'</b></div>');
	});

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
