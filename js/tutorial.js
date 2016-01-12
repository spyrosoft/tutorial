var Tutorial = function() {
	var sections = new Array();
	
	return {
		addSection : function( new_title, new_intro ) {
			var title = "";
			var intro = "";
			var correct_problems = "";
			var incorrect_problems = "";
			var problems = new Array();
			
			//TODO: Try breaking out the bigger functions into functions to avoid clutter
			sections.push(
				{
					"title" : function() {
						return title;
					},
					"intro" : function() {
						return intro;
					},
					"correctProblems" : function() {
						return correct_problems;
					},
					"incorrectProblems" : function() {
						return incorrect_problems;
					},
					"addProblem" : function( problem_identifier, answer_or_answers ) {
						if ( typeof answer_or_answers === "string"
							 || answer_or_answers instanceof Array ) {
								 problems[ problem_identifier ] = answer_or_answers;
							 } else {
								 throw "The new problem is not of type string or Array.";
							 }
					},
					"checkProblem" : function( problem_identifier, answer ) {
						var current_problem = problems[ problem_identifier ];
						if ( typeof current_problem === "string" ) {
							return current_problem === answer;
						} else if ( current_problem instanceof Array ) {
							var problem_correct = false;
							current_problem.forEach(
								function( current_problem_answer ) {
									if ( current_problem_answer === answer ) {
										problem_correct = true;
									}
								}
							);
							return problem_correct;
						}
						return false;
					}
				}
			);
		}
	};
};