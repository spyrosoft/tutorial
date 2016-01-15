$(document).foundation();

// I like to use objects for organizing data
// It's easy to rearrange things, everything is in one place, and it's simple to swap out with data pulled from a server
var simpleAdditionData = [
	{
		'identifier' : 'ones',
		'title' : 'Ones',
		'intro' : 'Practice adding one together with other numbers such as two and five.',
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
	},
	{
		'identifier' : 'twos',
		'title' : 'Twos',
		'intro' : 'Practice adding two together with other numbers.',
		'problems' : [
			{
				'identifier' : '2+1',
				'prompt' : '2 + 1',
				'answerOrAnswers' : '3'
			},
			{
				'identifier' : '2+2',
				'prompt' : '2 + 2',
				'answerOrAnswers' : '4'
			},
			{
				'identifier' : '2+3',
				'prompt' : '2 + 3',
				'answerOrAnswers' : '5'
			},
			{
				'identifier' : '2+4',
				'prompt' : '2 + 4',
				'answerOrAnswers' : '6'
			}
		]
	}
];

// As many instances of Tutorial can be made per page as you would like
// Assign each to a different variable
// In this demo this is the only one
var simpleAdditionTutorial = new Tutorial();

// An example technique for adding sections and problems in bulk from the data structure above:
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



// I like to have instructions appear before the tutorial starts
// If you would like the tutorial to begin immediately, this is not needed
$( 'button.begin' ).on( 'click', begin );

function begin() {
	$( '.tutorial-intro' ).addClass( 'display-none' );
	$( '.tutorial-content' ).removeClass( 'display-none' );
	$( '.answer' ).focus();
}

// Visit your URL and add #debug to the end for easier development
if ( window.location.hash.match( /debug/ ) ) {
	begin();
}



var currentSection;
var currentSectionIndex = 0;

function loadSection( sectionIdentifier ) {
	var sectionExists = false;
	for ( var sectionIndex in simpleAdditionData ) {
		if ( simpleAdditionData[ sectionIndex ][ 'identifier' ] === sectionIdentifier ) {
			sectionExists = true;
			currentSectionIndex = sectionIndex;
			break;
		}
	}
	if ( ! sectionExists ) { throw "The requested section: " + sectionIdentifier + " does not exist."; }
	currentSection = simpleAdditionTutorial.getSection( sectionIdentifier );
	$( '.section-title' ).html( currentSection.title() );
	message( currentSection.intro() );
	loadCurrentProblem();
}

function loadCurrentSection() {
	if ( currentSectionIndex >= simpleAdditionData.length ) {
		message( 'The tutorial is complete!' );
		return;
	}
	loadSection( simpleAdditionData[ currentSectionIndex ][ 'identifier' ] );
}

function loadNextSection() {
	currentSectionIndex++;
	loadCurrentSection();
}

loadCurrentSection();


function message( message ) {
	$( '.message' ).html( message );
}

function clearMessage() {
	message( '&nbsp;' );
}

function loadCurrentProblem() {
	var currentProblem = currentSection.getCurrentProblem();
	if ( currentProblem !== null ) {
		$( '.prompt' ).html( currentProblem.prompt() );
	} else {
		loadNextSection();
	}
}



$( 'input.answer' ).on( 'keydown', clearMessage );
$( 'input.answer' ).on( 'keydown', checkAnswerOnEnter );
$( 'button.check-answer' ).on( 'click', checkAnswer );

function checkAnswerOnEnter( keyEvent ) {
	if ( Utilities.isEnter( keyEvent ) ) { checkAnswer(); }
}

function checkAnswer() {
	var currentAnswer = $( '.answer' ).val();
	$( '.answer' ).val( '' );
	if ( currentSection.checkAnswer( currentAnswer ) ) {
		correctAnswer();
	} else {
		incorrectAnswer();
	}
}

function correctAnswer() {
	$( '.message' ).html( nextWordOfEncouragement() );
	loadCurrentProblem();
}

function incorrectAnswer() {
	var explanation = currentSection.getCurrentProblem().explanation();
	if ( explanation ) { message( explanation ); }
	else { message( 'Try again.' ); }
}

// Release some endorphins for the user when they answer problems correctly:
var wordsOfEncouragement = ['Excellent', 'Correct', 'Superb', 'Fantastic', 'Marvelous', 'Admirable', 'Ace', 'First-class', 'Dandy', 'Exquisite', 'Fantastic', 'Golden', 'Marvellous', 'Outstanding', 'Splendid', 'Magnificent', 'Smashing', 'Terrific', 'Topnotch', 'Tremendous', 'Wonderful', 'Champion', 'First-rate', 'Brilliant', 'Fabulous', 'Stunning', 'Commendable', 'Huzzah'];
var wordsOfEncouragementIndex = 0;

function nextWordOfEncouragement() {
	if ( wordsOfEncouragementIndex === wordsOfEncouragement.length ) {
		wordsOfEncouragementIndex = 0;
	}
	var wordOfEncouragement = wordsOfEncouragement[ wordsOfEncouragementIndex ];
	wordsOfEncouragementIndex++;
	return wordOfEncouragement;
}