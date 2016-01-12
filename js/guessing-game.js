var number_to_guess;
var number_to_guess_limit = 100;

$( document ).ready(
	function()
	{
		$( 'button' ).click( new_game );
	}
);

function generate_new_number_to_guess()
{
	return Math.ceil( Math.random() * number_to_guess_limit );
}

function new_game()
{
	number_to_guess = generate_new_number_to_guess();
	alert( 'I\'m thinking of a number between 1 and ' + number_to_guess_limit + '.' );
	prompt_and_check_user();
}

function prompt_and_check_user()
{
	var user_input_guess = prompt( 'Please make a guess what the number is.' );
	user_input_guess = scrub_user_input_guess( user_input_guess );
	
	if ( user_input_guess === false )
	{
		alert( 'Hey, that\'s not a number.' );
	}
	else if ( user_input_guess === null )
	{
		alert( 'Next time, then.' );
		return;
	}
	else if ( user_input_guess < number_to_guess )
	{
		alert( 'Too low.' );
	}
	else if ( user_input_guess > number_to_guess)
	{
		alert( 'Too high.' );
	}
	else if ( user_input_guess === number_to_guess)
	{
		alert( 'That was it!!' );
		return;
	}
	else
	{
		alert( 'An error occurred. Please contact the developer.' );
		return;
	}
	prompt_and_check_user();
}

function scrub_user_input_guess( user_input_guess )
{
	if ( user_input_guess === null )
	{
		return user_input_guess;
	}
	if ( user_input_guess != parseInt( user_input_guess ) )
	{
		return false;
	}
	return parseInt( user_input_guess );
}