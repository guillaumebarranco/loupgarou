"use strict";

$(document).ready(function() {

	/********************/
	/*	   VARIABLES    */
	/********************/

	// CONSTANTS
	var app_url = 'http://localhost:2000';
	var _this = this;
	var socket = io.connect(app_url);

	// VARIABLES
	var currentState = 'day';

	var players = [];
	players[0] = 'koko';
	players[1] = 'Gear 2nd';
	// players[2] = 'Perona';
	// players[3] = 'Hik';
	// players[4] = 'Gérard';

	var user_role;

	var composition = {};
	var roles = [];

	var username = $('.current_user').text();

	var all_roles = {};

	var search_role = {
		0: 'loup-garou',
		0: 'sorciere',
		0: 'villageois',
		0: 'voyante',
		0: 'cupidon',
		0: 'petite_fille',
		0: 'loup-garou',
		0: 'loup-garou',
		0: 'loup-garou',
		0: 'loup-garou',
	};

	

	/**********************/
	/*	     USERS        */
	/**********************/

	$('.getUsers').on('click', function() {

		makeAjax('GET', app_url+"/users/", '', function() {

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

	function getRoles() {

		makeAjax('GET', app_url+"/roles/", '', function() {

			$('.roles').empty();
			all_roles = _this.response;
			for (var i = 0; i < _this.response.length; i++) {
				$('.roles').append('<li><img width="20" src="img/roles/'+_this.response[i].picture+'.jpg" /><span>'+_this.response[i].name+'</span></li>');
			}
			console.log(all_roles);
		});
	}

	getRoles();

	//$('.getRoles').on('click', function() {

		
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
			$(".chat").scrollTop($(".chat")[0].scrollHeight);
		}
	});

	socket.on('newText', function (text) {
		$('.chat').append('<div><b>'+text.content.username+'</b>: '+text.content.content+'</div>');
		$(".chat").scrollTop($(".chat")[0].scrollHeight);
	});

	function justArrived() {

		$('.chat').append('<div class="byUser"><b>'+username+'</b> est arrivé dans le salon<div>');
		socket.emit('justArrived', {username:username});

		socket.on('newUser', function(username) {
			$('.chat').append('<div class="byUser"><b>'+username.username+'</b> est arrivé dans le salon<div>');
		});
	}

	justArrived();


	/*
	*	GAME
	*/

	$('.launchGame').on('click', function() {

		if(players.length === roles.length) {
			launchGame();

		} else if(players.length > roles.length) {
			alert('Il vous manque '+(players.length - roles.length)+' role(s).');
		} else if(players.length < roles.length) {
			alert('Il vous manque '+(roles.length - players.length)+' joueur(s).');
		}
	});

	var tab_random = [];

	function launchGame() {
		$('.launchGame').hide();

		for (var i = 0; i < players.length; i++) {

			var get_rand = rand(0, (players.length - 1));

			if(tab_random.indexOf(get_rand) != -1) {
				while(tab_random.indexOf(get_rand) != -1) {
					get_rand = rand(0, (players.length - 1));
				}
			}

			tab_random.push(get_rand);

			composition[i] = {};
			composition[i].player = players[get_rand];
			composition[i].role =  roles[i];
		}

		socket.emit('launchGame', {composition:composition});
	}

	socket.on('yourRole', function(compo) {

		$('.roles').empty();

		for (var i = 0; i < Object.size(compo.composition); i++) {
			if(compo.composition[i].player === $('.current_user').text()) {
				
				user_role = compo.composition[i].role.role_name.toLowerCase();

				$('.chat').append('<div class="byGame">Votre role est <b>'+user_role+'</b>. Ne le communiquez surtout pas ! Vous trouverez la description de votre rôle en survolant votre carte en haut à droite.<div>');
				$('.current_role').append('<div class="infos">Votre role est de tout faire pour tuer les loups-garous adverses en vous servant de vos pouvoirs.</div><img src="'+compo.composition[i].role.role_picture+'" width="150" />');
			}

			$('.roles').append('<li><img width="20" src="'+compo.composition[i].role.role_picture+'" /><span>'+compo.composition[i].role.role_name+'</span></li>');
		}

		beforeNight();

	});

	var interval;
	var timer = 4000;
	var time;
	var value = 1000;

	function beforeNight() {
		interval = setInterval(function() {

			time = Math.round((timer-value) /1000);

			if(time > 60) {
				$('.timer').text(time+' s');
				value = value + 1000;
			} else if(time < 60 && time > 0) {
				$('.timer').text(time+' s');
				value = value + 1000;
			} else if(time == 0) {
				clearInterval(interval);
				$('.timer').text('');
				makeNight();
				
			}
		}, 1000);
	}

	$('.clearChat').on('click', function() {
		$('.chat').empty();
	});

	function chatGame(text) {
		$('.chat').append('<div class="byGame">'+text+'</div>');
	}

	function chatPrivate(text) {
		$('.chat').append('<div class="byPrivate">'+text+'</div>');
	}

	/*
	*	NIGHT
	*/




	function makeNight() {
		$('.chat').append('<div class="byGame">La nuit est tombée.<div>');

		console.log('composition', composition);

		setTimeout(function() {

			for (var i = 0; i < Object.size(composition); i++) {

				switch(composition[i].role.role_name.toLowerCase()) {

					case 'corbeau':
						chatGame("Le corbeau va pouvoir désigner quelqu'un");
						if(user_role === 'corbeau') {
							chatPrivate("Qui voulez vous désigner ?");
						}
					break;

					case 'sorciere':
						var sosoHasPotion = true;

						if(sosoHasPotion) {
							chatGame("La sorcière va pouvoir utiliser ses potions");
							if(user_role === 'corbeau') {
								chatPrivate("Qui voulez vous désigner ?");
							}
						}
					break;

					case 'loup-garou':
						chatGame("Les loups-garous vont pouvoir dévorer quelqu'un");
					break;

					case 'loup-garou-blanc':
						var isNightPair = true;

						if(isNightPair) {
							chatGame("Le loup-garou blanc va pouvoir tuer un loup-garou");
						}

					break;

					case 'salvateur':
						chatGame("Le salvateur va pouvoir protéger quelqu'un.");
						if(user_role === 'salvateur') {
							chatPrivate("Qui voulez-vous protéger ?");
						}
					break;

					case 'voyante':
						chatGame("La voyante va pouvoir espionner un joueur");
						if(user_role === 'voyante') {
							chatPrivate("Qui souhaitez-vous espionner ?");
						}
					break;

					case 'chaman':
						chatGame("Le chaman va pouvoir communiquer avec les morts");
					break;

					default: break;
				}
			};
		}, 1000);

		//if(user_id_admin && night) socket.emit('night');
	}

	var user_id_admin = true;
	var night = true;



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








	// CHOOSE ROLES
	$(document).on('click', '.roles li', function() {

		if($(this).hasClass('composed')) {

			$(this).removeClass('composed');
			roles.unset($(this).find('span').text());

		} else {

			var role_name = $(this).find('span').text();
			var role_picture = $(this).find('img').attr('src');

			$(this).addClass('composed');
			roles.push({
				role_name,
				role_picture
			});
		}
	});




	/// RECUPERER LES ROOMS
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
	*	GENERIC FUNCTIONS
	*/

	function rand(min, max) {
		var the_random = Math.floor(Math.random() * (max - min + 1)) + min;
		return the_random;
	}

	Array.prototype.unset = function(val){
	    var index = this.indexOf(val)
	    if(index > -1){
	        this.splice(index,1)
	    }
	}

	Object.size = (obj) => {
	    var size = 0;
	    for (var key in obj) if (obj.hasOwnProperty(key)) size++;
	    return size;
	};

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
