var Tutorial = function() {
	var sections = new Object();
	
	var Section = function( newTitle, newIntro ) {
		var title = newTitle;
		var intro = newIntro;
		var retries = 3;
		var correctProblems = new Array();
		var incorrectProblems = new Array();
		var remainingProblems = new Array();
		
		//TODO: Try moving the bigger functions elsewhere to avoid clutter
		return {
			'title' : function() {
				return title;
			},
			'intro' : function() {
				return intro;
			},
			'remainingProblems' : function() {
				return remainingProblems;
			},
			'correctProblems' : function() {
				return correctProblems;
			},
			'incorrectProblems' : function() {
				return incorrectProblems;
			},
			'addProblem' : function( identifier, prompt, answerOrAnswers, explanation ) {
				var newProblem = new Problem( prompt, answerOrAnswers, explanation );
				remainingProblems[ identifier ] = newProblem;
			},
			'addProblemAnswer' : function( identifier, newAnswer ) {
				if ( remainingProblems[ identifier ] instanceof Array ) {
					remainingProblems[ identifier ].push( newAnswer );
				} else {
					var currentAnswer = remainingProblems[ identifier ];
					remainingProblems[ identifier ] = new Array();
					remainingProblems[ identifier ].push( currentAnswer );
					remainingProblems[ identifier ].push( newAnswer );
				}
			},
			'nextProblem' : function() {
				if ( remainingProblems.length === 0 ) { return null; }
				next
			},
			'checkProblem' : function( identifier, answer ) {
				var currentProblem = remainingProblems[ identifier ];
				if ( currentProblem.answerOrAnswers() instanceof Array ) {
					var problemCorrect = false;
					currentProblem.answerOrAnswers().forEach(
						function( currentProblemAnswer ) {
							if ( currentProblemAnswer === answer ) {
								problemCorrect = true;
							}
						}
					);
					return problemCorrect;
				} else {
					return currentProblem.answerOrAnswers() === answer;
				}
				return false;
			},
			'setTimesToRetryProblems' : function( newRetries ) {
				retries = newRetries;
			}
		};
	};
	
	var Problem = function( newPrompt, newAnswerOrAnswers, newExplanation ) {
		var prompt = newPrompt;
		var answerOrAnswers = newAnswerOrAnswers;
		var explanation = newExplanation;
		
		return {
			'prompt' : function() {
				return prompt;
			},
			'answerOrAnswers' : function() {
				return answerOrAnswers;
			},
			'explanation' : function() {
				return explanation;
			}
		};
	};
	
	return {
		addSection : function( identifier, title, intro ) {
			var newSection = new Section( title, intro );
			sections[ identifier ] = newSection;
			return newSection;
		},
		getSection : function( identifier ) {
			return sections[ identifier ];
		}
	};
};