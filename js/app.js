$(document).foundation();

// I like to use objects for organizing data
// It's easy to rearrange things, and everything is in one place
var simpleAdditionData = {
	'ones' : {
		'title' : 'Ones',
		'intro' : 'Practice adding one to other numbers such as two, or five.',
		'problems' : {
			'1+1' : {
				'prompt' : '1 + 1',
				'answerOrAnswers' : '2',
				// Explanations are optional
				'explanation' : 'If you have an apple, and then another apple is given to you somehow, now you have two apples. Awesome.'
			},
			'1+2' : {
				'prompt' : '1 + 2',
				'answerOrAnswers' : '3'
			},
			'1+3' : {
				'prompt' : '1 + 3',
				'answerOrAnswers' : '4'
			},
			'1+4' : {
				'prompt' : '1 + 4',
				'answerOrAnswers' : '5'
			}
		}
	}
};

// Create a new instance of Tutorial
var simpleAddition = new Tutorial();

for ( var sectionIdentifier in simpleAdditionData ) {
	var section = simpleAddition.addSection(
		sectionIdentifier,
		simpleAdditionData[ sectionIdentifier ].title,
		simpleAdditionData[ sectionIdentifier ].intro
	);
	
	addProblemsToSection( section, simpleAdditionData[ sectionIdentifier ].problems );
}

function addProblemsToSection( section, problems ) {
	for ( var problemIdentifier in problems ) {
		var explanation = null;
		if ( problems[ problemIdentifier ].explanation ) {
			explanation = problems[ problemIdentifier ].explanation;
		}
		section.addProblem(
			problemIdentifier,
			problems[ problemIdentifier ].prompt,
			problems[ problemIdentifier ].answer,
			explanation
		);
	}
}

