var Tutorial = function() {
	var sections = new Object();
	
	var Section = function( new_title, new_intro ) {
		var title = new_title;
		var intro = new_intro;
		var correct_problems = new Array();
		var incorrect_problems = new Array();
		var problems = new Array();
		
		//TODO: Try breaking out the bigger functions into functions to avoid clutter
		return {
			'title' : function() {
				return title;
			},
			'intro' : function() {
				return intro;
			},
			'correctProblems' : function() {
				return correct_problems;
			},
			'incorrectProblems' : function() {
				return incorrect_problems;
			},
			'addProblem' : function( identifier, prompt, answer_or_answers, explanation ) {
				var newProblem = new Problem( identifier, prompt, answer_or_answers, explanation );
				problems[ identifier ] = newProblem;
			},
			'addProblemAnswer' : function( identifier, new_answer ) {
				if ( problems[ identifier ] instanceof Array ) {
					problems[ identifier ].push( new_answer );
				} else {
					var current_answer = problems[ identifier ];
					problems[ identifier ] = new Array();
					problems[ identifier ].push( current_answer );
					problems[ identifier ].push( new_answer );
				}
			},
			'checkProblem' : function( identifier, answer ) {
				var current_problem = problems[ identifier ];
				if ( current_problem instanceof Array ) {
					var problem_correct = false;
					current_problem.forEach(
						function( current_problem_answer ) {
							if ( current_problem_answer === answer ) {
								problem_correct = true;
							}
						}
					);
					return problem_correct;
				} else {
					return current_problem === answer;
				}
				return false;
			}
		};
	};
	
	var Problem = function( new_prompt, new_answer_or_answers, new_explanation ) {
		var prompt = new_prompt;
		var answer_or_answers = new_answer_or_answers;
		var explanation = new_explanation;
		
		return {
			'prompt' : function() {
				return prompt;
			},
			'answerOrAnswers' : function() {
				return answer_or_answers;
			},
			'newExplanation' : function() {
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