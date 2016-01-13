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
		
		var firstSectionIdentifier = 'first';
		var firstSectionTitle = 'First Section';
		var firstSectionIntro = 'First section intro.';
		var firstSection = newTutorial.addSection( firstSectionIdentifier, firstSectionTitle, firstSectionIntro );
		
		assert.ok( firstSection instanceof Object );
		assert.ok( firstSection.title() === firstSectionTitle );
		assert.ok( firstSection.intro() === firstSectionIntro );
	}
);


QUnit.test(
	'Get a Section by it\'s identifier.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSectionIdentifier = 'first';
		var firstSectionTitle = 'First Section';
		var firstSectionIntro = 'First section intro.';
		newTutorial.addSection( firstSectionIdentifier, firstSectionTitle, firstSectionIntro );
		
		var firstSection = newTutorial.getSection( firstSectionIdentifier );
		
		assert.ok( firstSection instanceof Object );
		assert.ok( firstSection.title() === firstSectionTitle );
		assert.ok( firstSection.intro() === firstSectionIntro );
	}
);


QUnit.test(
	'Add and check questions.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSectionIdentifier = 'first';
		var firstSectionTitle = 'First Section';
		var firstSectionIntro = 'First section intro.';
		newTutorial.addSection( firstSectionIdentifier, firstSectionTitle, firstSectionIntro );
		
		var firstSection = newTutorial.getSection( firstSectionIdentifier );
		firstSection.addProblem( '1+1', '1 + 1', '2' );
		firstSection.addProblem( '1+2', '1 + 2', '3' );
		
		assert.ok( typeof firstSection.checkProblem( '1+1', '2' ) === 'boolean' );
		assert.ok( firstSection.checkProblem( '1+1', '2' ) );
		assert.ok( typeof firstSection.checkProblem( '1+2', '3' ) === 'boolean' );
		assert.ok( firstSection.checkProblem( '1+2', '3' ) );
		assert.ok( ! firstSection.checkProblem( '1+2', '4' ) );
		assert.ok( ! firstSection.checkProblem( '1+2', '1' ) );
	}
);


QUnit.test(
	'Verify number of remaining problems.',
	function( assert ) {
		var newTutorial = new Tutorial();
		
		var firstSectionIdentifier = 'first';
		var firstSectionTitle = 'First Section';
		var firstSectionIntro = 'First section intro.';
		newTutorial.addSection( firstSectionIdentifier, firstSectionTitle, firstSectionIntro );
		
		var firstSection = newTutorial.getSection( firstSectionIdentifier );
		firstSection.addProblem( '1+1', '1 + 1', '2' );
		firstSection.addProblem( '1+2', '1 + 2', '3' );
		firstSection.addProblem( '1+3', '1 + 3', '4' );
		
		firstSection.nextProblem();
		assert.ok( firstSection.remainingProblems().length === 2 );
	}
);