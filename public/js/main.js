$(document).ready(function() {

	var app_url = 'http://localhost:2000';
	var socket = io.connect(app_url);

	$.ajax({
			type : "GET",
			url : app_url+"/users/",
			success: function(response){
				console.log(response);
			},

			error: function(){
				console.log('error');
            }
		});

    // socket.emit('buttonColor', {color: color});
});