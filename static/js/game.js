function Game(gameName, createQuestionFunction, canvas, questions, answers) {

	var game = {
		inited : false,
		timmer : null,
		name : gameName,
		createQuestion : createQuestionFunction, 
		question : null,
		areas : {
			canvas : canvas,
			score : answers,
			question : questions
		}
	};
	
	function init() {
		if (!game.areas.score || !game.areas.question) {
			game.areas.score = document.createElement("DIV");
			game.areas.question = document.createElement("DIV");
			
			var scorebar = document.createElement("DIV");
			scorebar.className = "scorebar";
			scorebar.style.height = "10%";
			
			document.body.appendChild(scorebar);

			var q = document.createElement("DIV");
			q.style.width = "50%";
			
			var s = document.createElement("DIV");
			s.style.width = "50%";
			
			var lbq = document.createElement("DIV");
			lbq.innerHTML = "Respostas:";
			lbq.className = "lbl";
			
			var lbs = document.createElement("DIV");
			lbs.innerHTML = "Pontos:";
			lbs.className = "lbl";

			q.appendChild(lbq);
			q.appendChild(game.areas.question);
			scorebar.appendChild(q);
			
			s.appendChild(lbs);
			s.appendChild(game.areas.score);
			scorebar.appendChild(s);
			
		}
		if (!game.areas.canvas) {
			game.areas.canvas = document.createElement("DIV");
			game.areas.canvas.id = "canvas";
			game.areas.canvas.style.height = "90%";
			document.body.appendChild(game.areas.canvas);
		}
		game.inited = true;
	}

	
	function start() {
		if (!game.inited) {
			init();
		}
		
		game.timmer = window.setInterval(function() {
			if (!game.question) {
				try {
					var q = game.createQuestion(game.areas);
					if (!q) {
						console.log("ERROR: Could not create an question");
						return stop();
					}
					game.question = q;
					game.question.start();
				}
				catch (err) {
					console.log("Error when recycle game", err);
					stop();
				}
			}
		}, 200);
		console.log("game " + game.name + " started");
	}
	
	function pause() {
		window.clearInterval(game.timmer);
		if (game.question) {
			game.question.pause();
		}
		console.log("game " + game.name + " paused");
	}
	
	function stop() {
		window.clearInterval(game.timmer);
		console.log("game " + game.name + " stoped");
	}
	
	var PublicMethods = {
		start : start,
		pause : pause,
		stop : stop
	}
	
	return PublicMethods;
}