QUnit.test(
	'Create a new Tutorial instance.',
	function( assert ) {
		var newTutorial = new Tutorial();
		assert.ok( newTutorial instanceof Object );
	}
);


QUnit.test(
	'Create a new Section.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSectionID = 'first-section-ID';
		var firstSectionTitle = 'First Section Title';
		var firstSectionIntro = 'First section intro.';
		var firstSection = newTutorial.addSection( firstSectionID, firstSectionTitle, firstSectionIntro );
		
		assert.ok( firstSection instanceof Object );
		assert.ok( firstSection.title() === firstSectionTitle );
		assert.ok( firstSection.intro() === firstSectionIntro );
	}
);


QUnit.test(
	'Get a Section by it\'s ID.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSectionID = 'first-section-ID';
		var firstSectionTitle = 'First Section Title';
		var firstSectionIntro = 'First section intro.';
		newTutorial.addSection( firstSectionID, firstSectionTitle, firstSectionIntro );
		
		var firstSection = newTutorial.setCurrentSection( firstSectionID );
		
		assert.ok( firstSection instanceof Object );
		assert.ok( firstSection.title() === firstSectionTitle );
		assert.ok( firstSection.intro() === firstSectionIntro );
	}
);


QUnit.test(
	'Correct and incorrect answers work.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSection = newTutorial.addSection( 'first-section-ID', 'First Section Title', 'First section intro.' );
		firstSection.addProblem( '1+1', '1 + 1', '2' );
		firstSection.addProblem( '1+2', '1 + 2', '3' );
		
		var firstQuestion = firstSection.currentProblem();
		assert.ok( typeof firstSection.checkAnswer( firstQuestion.answer() ) === 'boolean' );
		
		var secondQuestion = firstSection.currentProblem();
		assert.ok( ! firstSection.checkAnswer( secondQuestion.answer() + 1 ) );
	}
);


QUnit.test(
	'A new/different problem is loaded when the first is answered correctly.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSection = newTutorial.addSection( 'first-section-ID', 'First Section Title', 'First section intro.' );
		firstSection.addProblem( '1+1', '1 + 1', '2' );
		firstSection.addProblem( '1+2', '1 + 2', '3' );
		
		var firstQuestion = firstSection.currentProblem();
		firstSection.checkAnswer( firstQuestion.answer() );
		
		var secondQuestion = firstSection.currentProblem();
		assert.ok( firstQuestion[ 'ID' ] !== secondQuestion[ 'ID' ] );
	}
);


QUnit.test(
	'Verify number of remaining problems.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSection = newTutorial.addSection( 'first-section-ID', 'First Section Title', 'First section intro.' );
		firstSection.addProblem( '1+1', '1 + 1', '2' );
		firstSection.addProblem( '1+2', '1 + 2', '3' );
		firstSection.addProblem( '1+3', '1 + 3', '4' );
		
		firstSection.currentProblem();
		assert.ok( firstSection.problemsRemaining().length === 2 );
	}
);


QUnit.test(
	'Verify number of correct problems.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSection = newTutorial.addSection( 'first-section-ID', 'First Section Title', 'First section intro.' );
		firstSection.addProblem( '1+1', '1 + 1', '2' );
		firstSection.addProblem( '1+2', '1 + 2', '3' );
		firstSection.addProblem( '1+3', '1 + 3', '4' );
		
		var currentProblem = firstSection.currentProblem();
		firstSection.checkAnswer( currentProblem.answer() );
		
		currentProblem = firstSection.currentProblem();
		firstSection.checkAnswer( currentProblem.answer() );
		
		assert.ok( firstSection.problemsCorrect().length === 2 );
	}
);


QUnit.test(
	'Problems retries increases by number of retries.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSection = newTutorial.addSection( 'first-section-ID', 'First Section Title', 'First section intro.' );
		firstSection.addProblem( '1+1', '1 + 1', '2' );
		firstSection.addProblem( '1+2', '1 + 2', '3' );
		firstSection.addProblem( '1+3', '1 + 3', '4' );
		
		firstSection.setTimesToRetryProblems( 3 );
		
		var currentProblem = firstSection.currentProblem();
		var incorrectAnswer = currentProblem.answer() + 1;
		firstSection.checkAnswer( currentProblem[ 'ID' ], incorrectAnswer );
		assert.ok( firstSection.problemsRetries().length === 3 );
	}
);