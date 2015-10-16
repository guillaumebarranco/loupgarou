"use strict";

$(document).ready(function() {

	var app_url = 'http://localhost:2000';
	var _this = this;

	var socket = io.connect(app_url);

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

	$('.sendChat').on('click', function() {
		var content = $('.textChat').val();
		if(content != '') socket.emit('buttonColor', {content: content});
		
	});

	socket.on('newText', function (text) {
		$('.chat').append('<div>'+text.content+'</div>');
	});

});
