var Tutorial = function() {
	// Look up sections by ID
	var sections = new Object();
	
	// Look up section IDs by index
	var sectionIDs = new Array();
	
	// Keep track of the current section index for looking up next or previous sections
	var currentSectionIndex;
	
	var Section = function( newTitle, newIntro ) {
		var title = newTitle;
		var intro = newIntro;
		var numberOfRetries = 3;
		var reviewInterval = 2;
		
		// mode can have a value of instruction, review, or mixed
		var mode = 'mixed';
		// Needed when mode is mixed to know if the current problem is instruction or review
		var currentMode = 'instruction';
		
		// Full problems which can be looked up by ID
		var problems = new Object();
		
		// Problem IDs which can be looked up by index in sequential order
		var problemsSequence = new Array();
		var currentProblemIndex = -1;
		
		// Problem IDs only (no use having redundant data) which can be looked up by index
		var problemSets = {
			'remaining' : new Array(),
			// The correct array contains problems marked correct on the first try
			'correct' : new Array(),
			'incorrect' : new Array(),
			'retries' : new Array()
		};
		
		// Problem ID of the current problem and the previous problem
		var currentProblem;
		var previousProblem;
		
		// nextProblemSetType can have a value of any of the problem sets or remainingOrRetries
		var nextProblemSetType = 'remainingOrRetries';
		// Needed when nextProblemSetType is 'remainingOrRetries' to know which type the current problem is
		var lastProblemSet;
		
		var randomOrSequential = 'sequential';
		
		// Used to locate and set the next problem for a given nextProblemSetType
		var nextProblemLookupByType = {
			'remainingOrRetries' : function() { nextProblemRemainingOrRetries(); },
			'remaining' : function() { nextProblemByType( 'remaining' ); },
			'incorrect' : function() { nextProblemByType( 'incorrect' ); },
			'correct' : function() { nextProblemByType( 'correct' ); }
		};
		
		// All types but remainingOrRetries; the others are straight forward
		var nextProblemByType = function( problemSet ) {
			lastProblemSet = problemSet;
			setCurrentProblemFromSet( problemSet );
		};
		
		//TODO: This function is too long:
		var nextProblemRemainingOrRetries = function() {
			var problemSet = remainingOrRetriesProblemSet();
			var problemID;
			
			if ( problemSet === null ) { setCurrentProblem( null, null ); return; }
			
			if ( randomOrSequential === 'sequential' ) {
				// If the current problem is null, this is the first problem in the set
				if ( currentProblem !== null ) {
					currentProblemIndex++;
				}
				if ( currentProblemIndex === problemSets[ problemSet ].length ) {
					setCurrentProblem( null, null );
					return;
				}
				problemID = problemSets[ problemSet ][ currentProblemIndex ];
			} else if ( randomOrSequential === 'random' ) {
				currentProblemIndex = getRandomProblemIndex( problemSet );
				problemID = problemSets[ problemSet ][ currentProblemIndex ];
				if ( problemID === previousProblem ) {
					nextProblemRemainingOrRetries();
					return;
				}
			} else {
				throw 'randomOrSequential needs to be either "random" or "sequential"; currently set to: ' + randomOrSequential;
			}
			
			setCurrentProblem( problemID, problemSet );
			
			if ( currentMode === 'review' ) {
				problemSets[ problemSet ].splice( currentProblemIndex, 1 );
			}
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
			var problemID = problemSets[ problemSet ][ problemIndex ];
			var newProblem = problems[ problemID ];
			newProblem[ 'ID' ] = problemID;
			return newProblem;
		};
		
		var setCurrentProblem = function( ID, problemSet ) {
			previousProblem = currentProblem;
			currentProblem = ID;
			lastProblemSet = problemSet;
		};
		
		return {
			// Access the read-only closed variables
			'title' : function() { return title; },
			'intro' : function() { return intro; },
			'currentMode' : function() { return currentMode; },
			'problems' : function () { return JSON.parse( JSON.stringify( problems ) ); },
			'problemsRemaining' : function() { return JSON.parse( JSON.stringify( problemSets[ 'remaining' ] ) ); },
			'problemsCorrect' : function() { return JSON.parse( JSON.stringify( problemSets[ 'correct' ] ) ); },
			'problemsIncorrect' : function() { return JSON.parse( JSON.stringify( problemSets[ 'incorrect' ] ) ); },
			'problemsRetries' : function() { return JSON.parse( JSON.stringify( problemSets[ 'retries' ] ) ); },
			
			//TODO: This may cause issues if the user wants to use an array as the value for a single answer - it will be treated as multiple answers
			'addProblem' : function( ID, prompt, answer, explanation ) {
				var newProblem = new Problem( prompt, answer, explanation );
				problems[ ID ] = newProblem;
				problemsSequence.push( ID );
				problemSets[ 'remaining' ].push( ID );
			},
			
			'addProblemAnswer' : function( ID, newAnswer ) {
				if ( problems[ ID ] instanceof Array ) {
					problems[ ID ].push( newAnswer );
				} else {
					var currentAnswer = problems[ ID ];
					problems[ ID ] = new Array();
					problems[ ID ].push( currentAnswer );
					problems[ ID ].push( newAnswer );
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
				identifiedCurrentProblem[ 'ID' ] = currentProblem;
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
				//TODO: What does this accomplish?
				if ( problemCorrect ) {
					setCurrentProblem( undefined, undefined );
				}
				if ( currentMode === 'review' ) {
					if ( problemCorrect ) {
						problemSets[ 'correct' ].push( currentProblem );
					} else {
						problemSets[ 'incorrect' ].push( currentProblem );
						for ( var i = 0; i < numberOfRetries; i++ ) {
							problemSets[ 'retries' ].push( currentProblem );
						}
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
			},
			
			//TODO: Delete this when finished
			tunnel : function() { return this; }
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
		addSection : function( ID, title, intro ) {
			var newSection = new Section( title, intro );
			sections[ ID ] = newSection;
			sectionIDs.push( ID );
			return newSection;
		},
		
		setCurrentSection : function( ID ) {
			if ( typeof sections[ ID ] === 'undefined' ) {
				throw 'No section identified by "' + ID + '" exists.';
			}
			var IDIndex = 0;
			for ( IDIndex in sectionIDs ) {
				if ( sectionIDs[ IDIndex ] === ID ) {
					currentSectionIndex = IDIndex;
				}
			}
			return this.currentSection();
		},
		
		currentSection : function() {
			if ( typeof currentSectionIndex === 'undefined' ) {
				if ( sectionIDs.length === 0 ) {
					throw "No sections have been created.";
				}
				currentSectionIndex = 0;
			}
			var identifiedCurrentSection = sections[ sectionIDs[ currentSectionIndex ] ];
			identifiedCurrentSection[ 'ID' ] = sectionIDs[ currentSectionIndex ];
			return identifiedCurrentSection;
		},
		
		loadNextSection : function() {
			currentSectionIndex++;
			if ( currentSectionIndex >= sectionIDs.length ) { return null; }
			return this.currentSection();
		}
	};
};