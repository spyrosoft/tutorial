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
		var numberOfRetries = 3;
		var reviewInterval = 2;
		var mode = 'mixed';
		
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
		
		// Needed when nextProblemSetType is 'remainingOrRetries' to know which type the current problem is
		var lastProblemSet;
		var nextProblemSetType = 'remainingOrRetries';
		
		var randomOrSequential = 'sequential';
		
		// Used to locate and set the next problem for a given nextProblemSetType
		var nextProblemLookupByType = {
			'remainingOrRetries' : function() { nextProblemRemainingOrIncorrect(); },
			'remaining' : function() { nextProblemByType( 'remaining' ); },
			'incorrect' : function() { nextProblemByType( 'incorrect' ); },
			'correct' : function() { nextProblemByType( 'correct' ); }
		};
		
		// All types but remainingOrRetries; the others are straight forward
		var nextProblemByType = function( problemSet ) {
			setCurrentProblemFromSet( problemSet );
			lastProblemSet = problemSet;
		};
		
		var nextProblemRemainingOrIncorrect = function() {
			var problemSet = remainingOrRetriesProblemSet();
			if ( problemSet === null ) { setCurrentProblem( null, null ); return; }
			var problemIndex = getRandomProblemIndex( problemSet );
			var problemIdentifier = problemSets[ problemSet ][ problemIndex ];
			if ( problemIdentifier === previousProblem ) {
				nextProblemRemainingOrIncorrect();
				return;
			}
			setCurrentProblem( problemIdentifier, problemSet );
			problemSets[ problemSet ].splice( problemIndex, 1 );
		};
		
		// For the remainingOrRetries nextProblemSetType, choose appropriately between the remaining or incorrect problem sets
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
			lastProblemSet = problemSet;
		};
		
		//TODO: Delete this when finished
		var tunnel = function() { return this; };
		
		
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
			'addProblem' : function( identifier, prompt, answer, explanation ) {
				var newProblem = new Problem( prompt, answer, explanation );
				problems[ identifier ] = newProblem;
			},
			
			'addProblemAnswer' : function( identifier, newAnswer ) {
				if ( problems[ identifier ] instanceof Array ) {
					problems[ identifier ].push( newAnswer );
				} else {
					var currentAnswer = problems[ identifier ];
					problems[ identifier ] = new Array();
					problems[ identifier ].push( currentAnswer );
					problems[ identifier ].push( newAnswer );
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
			
			'currentProblem' : function() {
				if ( currentProblem === undefined ) { nextProblemLookupByType[ nextProblemSetType ](); }
				if ( currentProblem === null ) { return null; }
				var identifiedCurrentProblem = problems[ currentProblem ];
				identifiedCurrentProblem[ 'identifier' ] = currentProblem;
				return identifiedCurrentProblem;
			},
			
			//TODO: This function is too long
			'checkAnswer' : function( answer ) {
				var problemCorrect = false;
				if ( problems[ currentProblem ].answer() instanceof Array ) {
					problems[ currentProblem ].answer().forEach(
						//TODO: Convert this to deepEquals for complex answer structures like arrays or objects
						function( problemAnswer ) {
							if ( problemAnswer === answer ) { problemCorrect = true; }
						}
					);
				} else {
					problemCorrect = problems[ currentProblem ].answer() === answer;
				}
				if ( problemCorrect ) {
					problemSets[ 'correct' ].push( currentProblem );
					setCurrentProblem( undefined, undefined );
				} else {
					problemSets[ 'incorrect' ].push( currentProblem );
					for ( var i = 0; i < numberOfRetries; i++ ) {
						problemSets[ 'retries' ].push( currentProblem );
					}
				}
				return problemCorrect;
			},
			
			'setTimesToRetryProblems' : function( newRetries ) {
				if ( newRetries === Math.floor( newRetries ) && newRetries >= 0 ) {
					numberOfRetries = newRetries;
				} else {
					throw 'The number of retries must be an integer greater than or equal to zero.';
				}
			},
			
			'setProblemType' : function( newNextProblemSetType ) {
				if ( ! nextProblemLookupByType[ newNextProblemSetType ] ) {
					throw 'The problem type "' + newNextProblemSetType + '" is not one of the following: "remainingOrRetries", "remaining", "incorrect", or "correct".';
				}
				nextProblemSetType = newNextProblemSetType;
			},

			'setRandomOrSequential' : function( newMethod ) {
				if ( newMethod !== 'random' || newMethod !== 'sequential' ) {
					throw 'Your problem selection method "' + newMethod + '" needs to be either "random" or "sequential".';
				}
				randomOrSequential = newMethod;
			}
		};
	};
	
	var Problem = function( newPrompt, newAnswer, newExplanation ) {
		var prompt = newPrompt;
		var answer = newAnswer;
		var explanation = newExplanation;
		
		return {
			'prompt' : function() { return prompt; },
			'answer' : function() { return answer; },
			'explanation' : function() { return explanation; }
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
			return this.currentSection();
		},
		
		currentSection : function() {
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
			return this.currentSection();
		}
	};
};