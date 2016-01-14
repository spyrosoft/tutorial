var Tutorial = function() {
	var sections = new Object();
	
	var Section = function( newTitle, newIntro ) {
		var title = newTitle;
		var intro = newIntro;
		var retries = 3;
		
		// Full problems which can be looked up by identifier
		var problems = new Object();
		
		// Problem identifiers only (no use having redundant data) which can be looked up by index
		var problemSets = {
			'remaining' : new Array(),
			'correct' : new Array(),
			'incorrect' : new Array(),
			'retries' : new Array()
		};
		
		// Problem identifier of the current problem and the previous problem
		var currentProblem;
		var previousProblem;
		
		// Needed when problemType is 'random'; the value may either be remaining or incorrect in this case
		var currentProblemSet;
		
		var problemType = 'random';
		
		// Used to locate and set the next problem for a given problemType
		var nextProblemLookupByType = {
			'random' : function() { nextProblemRandom(); },
			'remaining' : function() { nextProblemByType( 'remaining' ); },
			'incorrect' : function() { nextProblemByType( 'incorrect' ); },
			'correct' : function() { nextProblemByType( 'correct' ); }
		};
		
		// All types but random; the others are straight forward
		var nextProblemByType = function( problemSet ) {
			setRandomCurrentProblemFromSet( problemSet );
			currentProblemSet = problemSet;
		};
		
		var nextProblemRandom = function() {
			var problemSet = remainingOrIncorrectProblemSet();
			if ( problemSet === null ) { setCurrentProblem( null ); return; }
			var problemIndex = getRandomProblemIndex( problemSet );
			problemSet.splice( problemIndex, 1 );
			var problemIdentifier = problemSet[ problemIdentifier ];
			setCurrentProblem( problemIdentifier );
		};
		
		// For the random problemType, choose appropriately between the remaining or incorrect problem sets
		var remainingOrIncorrectProblemSet = function() {
			if ( problemSets[ 'remaining' ].length === 0 && problemSets[ 'incorrect' ].length === 0 ) { return null; }
			else if ( problemSets[ 'remaining' ].length === 0 ) { return 'incorrect'; }
			else if ( problemSets[ 'incorrect' ].length === 0 ) { return 'remaining'; }
			
			var totalAvailableProblems = problemSets[ 'remaining' ].length + problemSets[ 'incorrect' ].length;
			var randomIndex = Math.floor( Math.random() * totalAvailableProblems );
			//TODO: Is this an off by one error? It pretty much doesn't matter here, just curious.
			var problemSet = 'remaining';
			if ( randomIndex < problemSets[ 'incorrect' ].length ) {
				problemSet = 'incorrect';
			}
			return problemSet;
		};
		
		var setRandomCurrentProblemFromSet = function( problemSet ) {
			var problemIndex = getRandomProblemIndex( problemSet );
			setCurrentProblem( problemSet[ problemIndex ] );
		};
		
		var nextProblemRemaining = function() {
			
		};
		
		var nextProblemIncorrect = function() {
			
		};
		
		var nextProblemCorrect = function() {
			
		};
		
		var getRandomProblemIndex = function( problemSet ) {
			if ( problemSet.length === 0 ) { return null; }
			if ( ! uniqueProblemsExistInSet( problemSet ) ) {
				return 0;
			}
			var problemIndex = Math.floor( Math.random() * problemSet.length );
			if ( problemSet[ problemIndex ] === previousProblem ) {
				return getRandomProblemIndex( problemSet );
			}
			return problemIndex;
		};
		
		var uniqueProblemsExistInSet = function( problemSet ) {
			var uniqueProblemExists = false;
			var firstProblem = problemSet[ 0 ];
			var secondProblem;
			for ( var i = 1; i < problemSet.length; i++ ) {
				secondProblem = problemSet[ i ];
				if ( secondProblem != firstProblem ) {
					uniqueProblemExists = true;
					break;
				}
				firstProblem = secondProblem;
			}
			return uniqueProblemExists;
		};
		
		var getProblemByIndex = function( problemSet, problemIndex ) {
			var problemIdentifier = problemSet[ problemIndex ];
			var newProblem = problems[ problemIdentifier ];
			newProblem[ 'identifier' ] = problemIdentifier;
			return newProblem;
		};
		
		var setCurrentProblem = function( identifier, problemSet ) {
			previousProblem = currentProblem;
			currentProblem = identifier;
		};
		
		
		//TODO: Try moving the bigger functions elsewhere to avoid clutter
		return {
			// Access the read-only closed variables
			'title' : function() { return title; },
			'intro' : function() { return intro; },
			'problems' : function () { return problems; },
			'problemsRemaining' : function() { return problemSets[ 'remaining' ]; },
			'problemsCorrect' : function() { return problemSets[ 'correct' ]; },
			'problemsIncorrect' : function() { return problemSets[ 'incorrect' ]; },
			'problemsRetries' : function() { return problemSets[ 'retries' ]; },
			
			// This may cause issues if the user wants to use an array as the value for a single answer - it will be treated as multiple answers
			'addProblem' : function( identifier, prompt, answerOrAnswers, explanation ) {
				var newProblem = new Problem( prompt, answerOrAnswers, explanation );
				problems[ identifier ] = newProblem;
				problemSets[ 'remaining' ].push( identifier );
			},
			
			'addProblemAnswer' : function( identifier, newAnswer ) {
				var problemsRemaining = problemSets[ 'remaining' ];
				if ( problemsRemaining[ identifier ] instanceof Array ) {
					problemsRemaining[ identifier ].push( newAnswer );
				} else {
					var currentAnswer = problemsRemaining[ identifier ];
					problemsRemaining[ identifier ] = new Array();
					problemsRemaining[ identifier ].push( currentAnswer );
					problemsRemaining[ identifier ].push( newAnswer );
				}
			},
			
			'nextProblem' : function() {
				
			},
			
			'randomProblemRemaining' : function() {
				
			},
			
			'randomProblemIncorrect' : function() {
				
			},
			
			'randomProblemCorrect' : function() {
				
			},
			
			'currentProblem' : function() {
				if ( currentProblem === undefined ) { nextProblemLookupByType[ problemType ](); }
				if ( currentProblem === null ) { return null; }
				nextProblemLookupByType[ problemType ]();
				var identifiedCurrentProblem = problems[ currentProblem ];
				console.log(problems[currentProblem], currentProblem)
				identifiedCurrentProblem[ 'identifier' ] = currentProblem;
				return identifiedCurrentProblem;
			},
			
			'checkAnswer' : function( identifier, answer ) {
				var problem = problems[ identifier ];
				var problemCorrect = false;
				if ( problem.answerOrAnswers() instanceof Array ) {
					problem.answerOrAnswers().forEach(
						function( problemAnswer ) {
							if ( problemAnswer === answer ) {
								problemCorrect = true;
							}
						}
					);
				} else {
					problemCorrect = problem.answerOrAnswers() === answer;
				}
				if ( problemCorrect ) {
					problemSets[ 'correct' ].push( identifier );
				} else {
					problemSets[ 'incorrect' ].push( identifier );
					for ( var i = 0; i < retries; i++ ) {
						problemSets[ 'retries' ].push( identifier );
					}
				}
				return problemCorrect;
			},
			
			'setTimesToRetryProblems' : function( newRetries ) {
				if ( newRetries === Math.floor( newRetries ) && newRetries >= 0 ) {
					retries = newRetries;
				} else {
					throw 'The number of retries must be an integer greater than or equal to zero.';
				}
			},
			
			'setProblemType' : function( newProblemType ) {
				if ( ! nextProblemLookupByType[ newProblemType ] ) {
					throw 'The problem type "' + newProblemType + '" is not one of the following: "random", "remaining", "incorrect", or "correct".';
				}
				problemType = newProblemType;
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