$(document).foundation();

// I like to use objects for organizing data
// It's easy to rearrange things, everything is in one place, and it's simple to swap out with data pulled from a server
var simpleAdditionData = [
	{
		'identifier' : 'ones',
		'title' : 'Ones',
		'intro' : 'Practice adding one to other numbers such as two, or five.',
		'problems' : [
			{
				'identifier' : '1+1',
				'prompt' : '1 + 1',
				'answerOrAnswers' : '2',
				// Problem explanations are optional
				'explanation' : 'If you have an apple, and then another apple is given to you somehow, now you have two apples. Awesome.'
			},
			{
				'identifier' : '1+2',
				'prompt' : '1 + 2',
				'answerOrAnswers' : '3'
			},
			{
				'identifier' : '1+3',
				'prompt' : '1 + 3',
				'answerOrAnswers' : '4'
			},
			{
				'identifier' : '1+4',
				'prompt' : '1 + 4',
				'answerOrAnswers' : '5'
			}
		]
	}
];

var simpleAdditionTutorial = new Tutorial();

for ( var sectionIndex in simpleAdditionData ) {
	var section = simpleAdditionTutorial.addSection(
		simpleAdditionData[ sectionIndex ].identifier,
		simpleAdditionData[ sectionIndex ].title,
		simpleAdditionData[ sectionIndex ].intro
	);
	
	addProblemsToSection( section, simpleAdditionData[ sectionIndex ].problems );
}

function addProblemsToSection( section, problems ) {
	for ( var problemIndex in problems ) {
		var explanation = null;
		if ( problems[ problemIndex ].explanation ) {
			explanation = problems[ problemIndex ].explanation;
		}
		section.addProblem(
			problems[ problemIndex ].identifier,
			problems[ problemIndex ].prompt,
			problems[ problemIndex ].answerOrAnswers,
			explanation
		);
	}
}

