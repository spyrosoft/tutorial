var Tutorial = function() {
	// Look up sections by identifier
	var sections = new Object();
	
	// Look up section identifiers by index
	var sectionIdentifiers = new Array();
	
	// Keep track of the current section index for looking up next or previous sections
	var currentSectionIndex;
	
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
		
		// Needed when nextProblemType is 'random'; the value may either be remaining or incorrect in this case
		var currentProblemSet;
		
		var nextProblemType = 'random';
		
		var remainingProblemsSelectionMethod = 'random';
		
		// Used to locate and set the next problem for a given nextProblemType
		var nextProblemLookupByType = {
			'random' : function() { nextProblemRandom(); },
			'remaining' : function() { nextProblemByType( 'remaining' ); },
			'incorrect' : function() { nextProblemByType( 'incorrect' ); },
			'correct' : function() { nextProblemByType( 'correct' ); }
		};
		
		// All types but random; the others are straight forward
		var nextProblemByType = function( problemSet ) {
			setCurrentProblemFromSet( problemSet );
			currentProblemSet = problemSet;
		};
		
		var nextProblemRandom = function() {
			var problemSet = remainingOrRetriesProblemSet();
			if ( problemSet === null ) { setCurrentProblem( null, null ); return; }
			var problemIndex = getRandomProblemIndex( problemSet );
			var problemIdentifier = problemSets[ problemSet ][ problemIndex ];
			console.log( currentProblem, previousProblem )
			console.log( problemSets[ 'remaining' ], problemSets[ 'retries' ] )
			if ( problemIdentifier === previousProblem ) {
				nextProblemRandom();
				return;
			}
			setCurrentProblem( problemIdentifier, problemSet );
			problemSets[ problemSet ].splice( problemIndex, 1 );
		};
		
		// For the random nextProblemType, choose appropriately between the remaining or incorrect problem sets
		var remainingOrRetriesProblemSet = function() {
			if ( problemSets[ 'remaining' ].length === 0 && problemSets[ 'retries' ].length === 0 ) { return null; }
			else if ( problemSets[ 'remaining' ].length === 0 ) {
				//TODO: Add a unit test for this
				if ( ! uniqueProblemsExistInSet( problemSet ) ) {
					clearAllButTheFirstProblem( problemSet );
				}
				return 'retries';
			}
			else if ( problemSets[ 'retries' ].length === 0 ) { return 'remaining'; }
			
			var totalAvailableProblems = problemSets[ 'remaining' ].length + problemSets[ 'retries' ].length;
			var randomIndex = Math.floor( Math.random() * totalAvailableProblems );
			//TODO: Is this an off by one error? It pretty much doesn't matter here, just curious.
			var problemSet = 'remaining';
			if ( randomIndex < problemSets[ 'retries' ].length ) {
				problemSet = 'retries';
			}
			return problemSet;
		};
		
		var setCurrentProblemFromSet = function( problemSet ) {
			var problemIndex = getRandomProblemIndex( problemSet );
			setCurrentProblem( problemSets[ problemSet ][ problemIndex ], problemSet );
		};
		
		var getRandomProblemIndex = function( problemSet ) {
			if ( problemSets[ problemSet ].length === 0 ) { return null; }
			var problemIndex = Math.floor( Math.random() * problemSets[ problemSet ].length );
			return problemIndex;
		};
		
		var uniqueProblemsExistInSet = function( problemSet ) {
			console.log('unique', problemSet)
			if ( problemSets[ problemSet ].length == 1 ) { return true; }
			var uniqueProblemExists = false;
			var firstProblem = problemSets[ problemSet ][ 0 ];
			var secondProblem;
			for ( var i = 1; i < problemSets[ problemSet ].length; i++ ) {
				secondProblem = problemSets[ problemSet ][ i ];
				if ( secondProblem != firstProblem ) {
					uniqueProblemExists = true;
					break;
				}
				firstProblem = secondProblem;
			}
			return uniqueProblemExists;
		};
		
		var clearAllButTheFirstProblem = function( problemSet ) {
			var firstProblem = problemSets[ problemSet ][ 0 ];
			problemSets[ problemSet ] = new Array();
			problemSets[ problemSet ].push( firstProblem );
		};
		
		var getProblemByIndex = function( problemSet, problemIndex ) {
			var problemIdentifier = problemSets[ problemSet ][ problemIndex ];
			var newProblem = problems[ problemIdentifier ];
			newProblem[ 'identifier' ] = problemIdentifier;
			return newProblem;
		};
		
		var setCurrentProblem = function( identifier, problemSet ) {
			previousProblem = currentProblem;
			currentProblem = identifier;
			currentProblemSet = problemSet;
		};
		
		//TODO: Delete this when finished
		var tunnel = function() { return this; };
		
		
		//TODO: Split up the bigger functions
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
			
			'markProblemCorrect' : function() {
				
			},
			
			'markProblemIncorrect' : function() {
				
			},
			
			'randomProblemByType' : function( problemSet ) {
				
			},
			
			'sequentialProblemByType' : function( problemSet ) {
				
			},
			
			'getCurrentProblem' : function() {
				if ( currentProblem === undefined ) { nextProblemLookupByType[ nextProblemType ](); }
				if ( currentProblem === null ) { return null; }
				var identifiedCurrentProblem = problems[ currentProblem ];
				identifiedCurrentProblem[ 'identifier' ] = currentProblem;
				return identifiedCurrentProblem;
			},
			
			'checkAnswer' : function( answer ) {
				var problemCorrect = false;
				if ( problems[ currentProblem ].answerOrAnswers() instanceof Array ) {
					problems[ currentProblem ].answerOrAnswers().forEach(
						//TODO: Convert this to deepEquals for complex answer structures like arrays or objects
						function( problemAnswer ) {
							if ( problemAnswer === answer ) {
								problemCorrect = true;
							}
						}
					);
				} else {
					problemCorrect = problems[ currentProblem ].answerOrAnswers() === answer;
				}
				if ( problemCorrect ) {
					problemSets[ 'correct' ].push( currentProblem );
					setCurrentProblem( undefined, undefined );
				} else {
					problemSets[ 'incorrect' ].push( currentProblem );
					for ( var i = 0; i < retries; i++ ) {
						problemSets[ 'retries' ].push( currentProblem );
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
			
			'setProblemType' : function( newNextProblemType ) {
				if ( ! nextProblemLookupByType[ newNextProblemType ] ) {
					throw 'The problem type "' + newNextProblemType + '" is not one of the following: "random", "remaining", "incorrect", or "correct".';
				}
				nextProblemType = newNextProblemType;
			},

			'setRemainingProblemsSelectionMethod' : function( newMethod ) {
				if ( newMethod !== 'random' || newMethod !== 'sequential' ) {
					throw 'Your remaining problem selection method "' + newMethod + '" needs to be either "random" or "sequential".';
				}
				remainingProblemsSelectionMethod = newMethod;
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
			sectionIdentifiers.push( identifier );
			return newSection;
		},
		
		setCurrentSection : function( identifier ) {
			if ( typeof sections[ identifier ] === 'undefined' ) {
				throw 'No section identified by "' + identifier + '" exists.';
			}
			var identifierIndex = 0;
			for ( identifierIndex in sectionIdentifiers ) {
				if ( sectionIdentifiers[ identifierIndex ] === identifier ) {
					currentSectionIndex = identifierIndex;
				}
			}
			return this.getCurrentSection();
		},
		
		getCurrentSection : function() {
			if ( typeof currentSectionIndex === 'undefined' ) {
				if ( sectionIdentifiers.length === 0 ) {
					throw "No sections have been created.";
				}
				currentSectionIndex = 0;
			}
			var identifiedCurrentSection = sections[ sectionIdentifiers[ currentSectionIndex ] ];
			identifiedCurrentSection[ 'identifier' ] = sectionIdentifiers[ currentSectionIndex ];
			return identifiedCurrentSection;
		},
		
		loadNextSection : function() {
			currentSectionIndex++;
			if ( currentSectionIndex >= sectionIdentifiers.length ) { return null; }
			return this.getCurrentSection();
		}
	};
};