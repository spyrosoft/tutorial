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