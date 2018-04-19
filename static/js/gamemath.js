function GameMath(params) {

	var level = params.level;
	var seed = params.seed;
	
	var game = new Game("Math", createQuestion, params.canvas, params.questions, params.answers);

	var PublicMethods = {
		start : game.start,
		pause : game.pause,
		stop : game.stop
	}
	
	var actualLevel = level || 1;
	const MATH_QTYPES = {
		SUM : { name : "Soma", priority : 1, level : 1 },
		SUB : { name : "Subtração", priority : 1, level : 1 },
		DIV : { name : "Divisão", priority : 1, level : 1 },
		MULT : { name : "Multiplicação", priority : 1, level : 1 },
//		POT : { name : "Potenciação", priority : 2, level : 1 },
//		SFRA : { name : "Simplificação de Frações", priority : 2, level : 1 },
//		MMC : { name : "Menor Multiplo Comum", priority: 2, level : 1 },
//		MDC : { name : "Maior Divisor Comum", priority : 2, level : 1 },
//		EXPS : { name : "Expressões simples", priority : 3, level : 2 },
//		EXP2 : { name : "Expressões Segundo Grau", priority : 3, level : 3 }
	}

	const SEED_SEPARATOR = "=";

	function chooseType() {
		var types = [];
		var keys = Object.keys(MATH_QTYPES);
		keys.map(function(t) {
			if (MATH_QTYPES[t].level >= actualLevel) {
				for (var i = 0; i < keys.length / MATH_QTYPES[t].priority; i++) {
					types.push(t.toLowerCase());
				}
			}
		});
		return types[Math.floor(Math.random() * types.length)];
	}
	
	function isValidSeed(seed) {
		if (!seed) {
			return false;
		}
		var s = seed.toLowerCase().split(SEED_SEPARATOR);
		if (s.length < 3) {
			return false
		}
		var found = false;
		Object.keys(MATH_QTYPES).map(function(type) {
			found = found || s[0] == type;
		});
		if (!found) {
			return false;
		}
		switch (s[0]) {
			case "div":
			case "pot":
				if (s[s.length-1] == "0") {
					return false;
				}
			case "sum":
			case "sub":
			case "mult":
			case "mmc" :  //		MMC : { name : "Menor Multiplo Comum", priority: 2, level : 1 },
			case "mdc" :  //		MDC : { name : "Maior Divisor Comum", priority : 2, level : 1 },
				for (var a = 1; a < s.length; a++) {
					if (isNAN(parseInt(s[a],10))) {
						return false;
					}
				}
				break;
			case "sfra" : //		SFRA : { name : "Simplificação de Frações", priority : 2, level : 1 },
			case "exps" :  //		EXPS : { name : "Expressões simples", priority : 3, level : 2 },
			case "exp2" :  //		EXP2 : { name : "Expressões Segundo Grau", priority : 3, level : 3 }
				console.log("Type unimplemented yet", s[0], " Seed: " + seed);
				return false;
			default:
				console.log("Unknown type", s[0], " Seed: " + seed);
				return false;
		}
		return true;
	}
	
	function getSeed(seed) {
		if (isValidSeed(seed)) {
			return seed;
		}
		return createSeed();
	}
	
	function createSeed() {
		var type = chooseType();
		var seed = type;
		switch (type) {
			case "mult":
				var max = 10;
				for (var i = 0; i < 2; i++) {
					var m = max;
					if (i == 0) {
						m = max * actualLevel;
					}
					seed += SEED_SEPARATOR + (Math.floor(Math.random() * m)+1);
				}
				if (actualLevel > 2) {
					seed += SEED_SEPARATOR + Math.round(Math.random() * 3);
				}
				break;
			case "div":
				var max = 10;
				var n = Math.floor(Math.random() * max) + 1;
				var d = Math.floor(Math.random() * (max * actualLevel)) + 1;
				seed += SEED_SEPARATOR + (n*d) + SEED_SEPARATOR + n;
				break;
			case "sum":
				var max = 1;
				for (var i = 0; i < actualLevel; i++) {
					max = max * 10;
				}
				for (var i = 0; i < Math.min(3, actualLevel+1); i++) {
					seed += SEED_SEPARATOR + (Math.floor(Math.random() * max)+1);
				}
				break;
			case "sub":
				var max = 1;
				for (var i = 0; i < actualLevel; i++) {
					max = max * 10;
				}
				var terms = [];
				for (var i = 0; i < Math.min(3, actualLevel+1); i++) {
					terms.push(Math.floor(Math.random() * max));
				}
				terms.reverse();
				if (actualLevel < 3) {
					tot = terms[0];
					for (var i = 1; i < terms.length; i++) {
						tot -= terms[i];
					}
					if (tot <= 0) {
						terms[0] += Math.abs(tot) + Math.floor(Math.random() * Math.min(Math.abs(tot)/2, Math.floor(Math.random() * max)))+1;
					}
				}
				for (var i = 0; i < terms.length; i++) {
					seed += SEED_SEPARATOR + terms[i];
				}
				break;
				
			case "mmc" :  //		MMC : { name : "Menor Multiplo Comum", priority: 2, level : 1 },
				var max = 10;
				var n1 = Math.floor(Math.random() * max);
				while (n1 <= 1) {
					n1 = Math.floor(Math.random() * max);
				}
				var n2 = Math.floor(Math.random() * max);
				while (n2 <= 1 || n1 == n2) {
					n2 = Math.floor(Math.random() * max);
				}
				seed += SEED_SEPARATOR + n1 + SEED_SEPARATOR + n2;
				break;
			case "mdc" :  //		MDC : { name : "Maior Divisor Comum", priority : 2, level : 1 },
				var max = 10;
				var n1 = Math.floor(Math.random() * max);
				while (n1 <= 1) {
					n1 = Math.floor(Math.random() * max);
				}
				var n2 = Math.floor(Math.random() * max);
				while (n2 <= 1 || n1 == n2) {
					n2 = Math.floor(Math.random() * max);
				}
				var n3 = Math.floor(Math.random() * max);
				while (n3 <= 1 || n3 == n2) {
					n3 = Math.floor(Math.random() * max);
				}
				seed += SEED_SEPARATOR + (n1*n2) + SEED_SEPARATOR + (n1*n3);
			case "sfra" : //		SFRA : { name : "Simplificação de Frações", priority : 2, level : 1 },
			case "exps" :  //		EXPS : { name : "Expressões simples", priority : 3, level : 2 },
			case "exp2" :  //		EXP2 : { name : "Expressões Segundo Grau", priority : 3, level : 3 }
				console.log("Type unimplemented yet ", type);
				return null;
			default:
				console.log("Unknown type for create seed ", type);
				return null;
		}
		return seed;
		
	}
	
	function getQuestionText(seed) {
		if (!seed) {
			return null;
		}
		var appendNumbers = function(numbers, operator) {
			var qt = " <STRONG>" + numbers[0] + "</STRONG>";
			for (var i = 1; i < numbers.length; i++) {
				qt += " " + operator + " <STRONG>" + numbers[i] + "</STRONG>";				
			}
			return qt;
		}
		var questionText = "";
		var s = seed.toLowerCase().split(SEED_SEPARATOR);
		var type = s[0];
		switch (type) {
			case "sum":
				questionText = "Qual é o resultado da " + MATH_QTYPES[s[0].toUpperCase()].name + appendNumbers(s.slice(1), "+") + " ?";
				break;
			case "sub":
				questionText = "Qual é o resultado da " + MATH_QTYPES[s[0].toUpperCase()].name + appendNumbers(s.slice(1), "-") + " ?";
				break;
			case "mult":
				questionText = "Qual é o resultado da " + MATH_QTYPES[s[0].toUpperCase()].name + appendNumbers(s.slice(1), "x") + " ?";
				break;
			case "div":
				questionText = "Qual é o resultado da " + MATH_QTYPES[s[0].toUpperCase()].name + " de" + appendNumbers(s.slice(1), "por") + " ?";
				break;
			case "mmc" :  //	 MMC : { name : "Menor Multiplo Comum", priority: 2, level : 1 },
			case "mdc" :  //	 MDC : { name : "Maior Divisor Comum", priority : 2, level : 1 },
				questionText = "Qual é o " + MATH_QTYPES[s[0].toUpperCase()].name + " entre" + appendNumbers(s.slice(1)) + " ?";
				break;
			case "sfra" : //	 SFRA : { name : "Simplificação de Frações", priority : 2, level : 1 },
			case "exps" :  // EXPS : { name : "Expressões simples", priority : 3, level : 2 },
			case "exp2" :  // EXP2 : { name : "Expressões Segundo Grau", priority : 3, level : 3 }
			default:
				questionText = MATH_QTYPES[s[0].toUpperCase()].name + ":" + appendNumbers(s.slice(1)) + " ?";
		}
		return questionText;
	}
	
	function getSolution(seed) {
		if (!seed) {
			return null;
		}
		var s = seed.toLowerCase().split(SEED_SEPARATOR);
		return solution(s[0], s.slice(1));
	}
	function solution(type, numbers) {
		var sol = 0;
		switch (type) {
			case "sum":
				for (var i = 0; i < numbers.length; i++) {
					sol += parseInt(numbers[i],10);
				}
				break;
			case "sub":
				for (var i = 0; i < numbers.length; i++) {
					sol -= parseInt(numbers[i],10);
				}
				break;
			case "mult":
				for (var i = 0; i < numbers.length; i++) {
					sol *= parseInt(numbers[i],10);
				}
				break;
			case "div":
				sol = parseInt(numbers[0],10) / parseInt(numbers[1],10);
				break;
			case "mmc":  //	 MMC : { name : "Menor Multiplo Comum", priority: 2, level : 1 },
			    var n1 = parseInt(numbers[0],10);
			    var n2 = parseInt(numbers[1],10);
			    var rest = 0;
			    do {
			        rest = n1 % n2;
			        n1 = n2;
			        n2 = rest;
			    } while (rest != 0);
			    sol = (parseInt(numbers[0],10) * parseInt(numbers[1],10)) / n1;
			    break;
			case "mdc" :  //	 MDC : { name : "Maior Divisor Comum", priority : 2, level : 1 },
			    var sol = parseInt(numbers[0],10);
			    var n2 = parseInt(numbers[1],10);
			    while (n2 != 0) {
			        var rest = sol % n2;
			        sol = n2;
			        n2 = rest;
			    }
				break;
			case "sfra" : //	 SFRA : { name : "Simplificação de Frações", priority : 2, level : 1 },
				var mdc = solution("mdc", numbers) || 1;
				sol = [parseInt(numbers[0],10)/mdc, parseInt(numbers[1],10)/mdc];
			case "exps" :  // EXPS : { name : "Expressões simples", priority : 3, level : 2 },
			case "exp2" :  // EXP2 : { name : "Expressões Segundo Grau", priority : 3, level : 3 }
			default:
				sol = null;
		}
		return sol;
	}
	
	function createQuestion(areas) {
		
		var seed = getSeed(seed);
		if (!seed) {
			return null;
		}
		
		var appendQuestionText = function() {
			var questArea = document.createElement("DIV");
			areas.canvas.appendChild(questArea);
			questArea.innerHTML = getQuestionText(seed);
		}
		var removeQuestionText = function() {
			areas.canvas.removeChild(questArea);
		}
		
		var answers = [];
		var solution = getSolution(seed);
		answers.push(solution);
		
		var s = seed.toLowerCase().split(SEED_SEPARATOR);
		var type = s[0];
		
		function createAnswers(max, array) {
			var used = [0];
			while (array.length < 5) {
				var n = Math.floor(Math.random() * max);
				if (used.indexOf(n) >= 0) {
					continue;
				}
				used.push(n);
				if (Math.round(Math.random() * max) % 2) {
					array.push(solution + n);
				} else {
					array.push(solution - n);
				}
			}
		}
		
		switch (type) {
			case "sum":
			case "sub":
			case "mult":
				var max = 5;
				for (var i = 0; i < actualLevel; i++) {
					max += 5;
				}
				createAnswers(max, answers);
				break;
			case "div":
			case "mmc" :  //	 MMC : { name : "Menor Multiplo Comum", priority: 2, level : 1 },
			case "mdc" :  //	 MDC : { name : "Maior Divisor Comum", priority : 2, level : 1 },
				createAnswers(solution, answers);
				break;
			case "sfra" : //	 SFRA : { name : "Simplificação de Frações", priority : 2, level : 1 },
			case "exps" :  // EXPS : { name : "Expressões simples", priority : 3, level : 2 },
			case "exp2" :  // EXP2 : { name : "Expressões Segundo Grau", priority : 3, level : 3 }
				break;
		}
		
	    for (var i = answers.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = answers[i];
	        answers[i] = answers[j];
	        answers[j] = temp;
	    }
		
		return new MathQuestion({seed : seed, 
								solution : solution,
								answers : answers, 
								areas : { canvas : params.canvas, 
										  questions: params.questions, 
										  answers : params.answers
							    },
							    funcs : { 
							    		start : function() {
							    			console.log("Start MathQuestion");
							    			appendQuestionText();
							    		},
							    		stop : function() {
							    			console.log("Stop MathQuestion");
							    			removeQuestionText();
							    		}
							    }
		});
	}
	
	return PublicMethods;
}

function MathQuestion(params) {

	var seed = params.seed;
	var answers = params.answers;
	var areas = params.areas;
	var solution = params.solution;
	
	var question = new Question({
		id : seed || "MathQuest",
		time : 10000,
		answers : createAnswers(areas, answers, solution),
		funcs : {
			start : function() {console.log("MathQuestion Started: ", seed, ansers)},
			stop : function() {console.log("MathQuestion Stoped")},
		}
	});
	
	function createAnswers(areas, answers, solution) {
		
		var result = [];
		var doms = [];
		for (var a = 0; a < answers.length; a++) {
			doms[a] = document.createElement("DIV");
			doms[a].className = "border border-secondary m-3 shadow btn btn-info";
			doms[a].innerHTML = answers[a];

			var clickFnc;
			if (solution = answers[a]) {
				clickFnc = function(e) {
					console.log("clickou certo", answers[a]);
					areas.questions.innerHTML = parseInt(areas.questions.innerText, 10) + 1;
					areas.answers.innerHTML = parseInt(areas.answers.innerText, 10) + 1;
					question.stop();
				}
			} else {
				clickFnc = function(e) {
					console.log("clickou errado ", answers[a], " certo era: ", solution);
					areas.questions.innerHTML = parseInt(areas.questions.innerText, 10) + 1;
					question.stop();
				};
			}
			
			var show = function() {
				console.log("show math answer", answers[a]);
				areas.canvas.appendChild(doms[a]);
				doms[a].addEventListener("mousedown", clickFnc);
			};
			var remove = function() {
				console.log("remove math answer", answers[a]);
				doms[a].removeEventListener("mousedown", clickFnc);
				areas.canvas.removeChild(doms[a]);
			}
			result.push(new Answer({
					id : answers[a],
					funcs : {
						show : show,
						remove : remove
					}
				})
			);
		}
		
		return result;
	}
	
	function start() {
		params.funcs.start();
		question.start();
	}
	function stop() {
		params.funcs.stop();
		question.stop();
		
	}
	function pause() {
		question.pause();
	}
	
	var PublicMethods = {
		start : start,
		pause : pause,
		stop : stop
	}
	
	return PublicMethods;
}

