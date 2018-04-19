function Question(params) {
	var doNothing = function() {};
	var quest = {
		id : params.id || "",
		inited : false,
		timmer : null,
		time : params.time || 10000,
		periodsTime : params.periodsTime || 200,
		answers : params.answers || [],
		funcs : {
			beforeStartAnswers : params.beforeStartAnswers || doNothing,
			start : params.start || doNothing,
			pause : params.pause || doNothing,
			stop : params.stop || doNothing,
			everyCycle : params.everyCycle || doNothing
		}
	};
	
	function start() {
		
		quest.timmer = window.setInterval(function() {
			if (!quest.inited) {
				quest.funcs.beforeStartAnswers();
				for (var a in quest.answers) {
					quest.answers[a].show();
				}
				quest.funcs.start();
			} 
			else if (quest.time > 0) {
				quest.time -= quest.periodsTime;
				quest.funcs.everyCycle(quest.time);
			} 
			else {
				stop();
			}
			quest.inited = true;
		}, quest.periodsTime);
		console.log("question " + quest.id + " started");
	}
	
	function pause() {
		window.clearInterval(quest.timmer);
		quest.funcs.pause();
		console.log("question " + quest.id + " paused");
	}
	
	function stop() {
		window.clearInterval(quest.timmer);
		for (var a in quest.answers) {
			quest.answers[a].remove();
		}
		quest.funcs.stop();
		console.log("question " + quest.id + " stoped");
	}
	
	var PublicMethods = {
		start : start,
		pause : pause,
		stop : stop,
	}
	
	return PublicMethods;
}

function Answer(params) {
	var doNothing = function() {};
	var ans = {
		id : params.id || "",
		inited : false,
		funcs : {
			show : params.funcs.show || doNothing,
			remove : params.funcs.remove || doNothing
		}
	};
	
	function show() {
		if (!ans.inited) {
			ans.funcs.show();
		}
		ans.inited = true;
		console.log("answer " + ans.id + " showed");
	}
	
	function remove() {
		ans.funcs.remove();
		console.log("answer " + ans.id + " removed");
	}
	
	var PublicMethods = {
		show : show,
		remove : remove,
	}
	
	return PublicMethods;
}





