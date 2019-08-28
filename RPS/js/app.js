/* Setting up score variables */ 
let userScore = 0;
let comptuerScore = 0;

/* Selecting elements from the DOM */
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector('.score-Board');

const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const palm_div = document.getElementById("p");
const siccor_div = document.getElementById("s");


function convertToWord(letter) {

	if (letter === "r") return "Rock";
	if (letter === "p") return "Paper";
	return "Scissors";
}

function getComputerChoice() {
	const choices = ['r', 'p', 's']
	const randomNumber = Math.floor(Math.random()* 3); /* random number between 0 - 3 not including 3 */
	return choices[randomNumber]; /* use one of the random numbers as an index to select from choices */ 
}



function wins(userChoice, computerChoice ) {
	userScore++;  /* updating user score */
	userScore_span.innerHTML = userScore;  /* Displaying user score in the HTML object */
	const smallString1 = "user".fontsize(3).sub(); /* changing this to a subscript */
	const smallString2 = "comp".fontsize(3).sub();
	result_p.innerHTML = `${convertToWord(userChoice)}${smallString1} beats ${convertToWord(computerChoice)}${smallString2} . You win `;
	document.getElementById(userChoice).classList.add('green-glow'); /* special effects */
	setTimeout(function() {document.getElementById(userChoice).classList.remove('green-glow')}, 300);
}


function lose(userChoice, computerChoice) {
	comptuerScore++; /* updating computer score */
	computerScore_span.innerHTML = comptuerScore; /* Displaying computer score in the HTML object */
	const smallString1 = "user".fontsize(3).sub(); 
	const smallString2 = "comp".fontsize(3).sub();
	result_p.innerHTML = `${convertToWord(userChoice)}${smallString1} loses to ${convertToWord(computerChoice)}${smallString2} . You Lost `;
	document.getElementById(userChoice).classList.add('red-glow'); /* special effects */
	setTimeout(function() {document.getElementById(userChoice).classList.remove('red-glow')}, 300);
}

function draw(userChoice, computerChoice) {
	const smallString1 = "user".fontsize(3).sub();
	const smallString2 = "comp".fontsize(3).sub();
	result_p.innerHTML = `${convertToWord(userChoice)}${smallString1} equals ${convertToWord(computerChoice)}${smallString2} . Its a draw `;
	document.getElementById(userChoice).classList.add('gray-glow'); /* special effects */
	setTimeout(function() {document.getElementById(userChoice).classList.remove('gray-glow')}, 300);
}


function game(userChoice) {
	const computerChoice = getComputerChoice()
	/* get user choice from the argument we give, get computer choice from the function above */
	switch (userChoice + computerChoice) {
		/* setting up winner use case. All combinations that lead to a user winning */ 
		case "rs":
		case "pr":
		case "sp":
			wins(userChoice, computerChoice)
			break;
		/* setting up loosing use case. */
		case "rp":
		case "ps":
		case "sr":
			lose(userChoice, computerChoice);
			break;
		/* setting up draw use case. */
		case "rr":
		case "pp":
		case "ss":
			draw(userChoice, computerChoice);
			break;
	}
	
}

function main() {

	/* when the div surrounding the rock element is clicked call game function */
	rock_div.addEventListener('click', function() {
		game("r");
	});


	/* when the div surrounding the paper element is clicked call game function */
	palm_div.addEventListener('click', function() {
		game("p");
	});

	/* when the div surrounding the scissor element is clicked call game function */
	siccor_div.addEventListener('click', function() {
		game("s");
	});
}


main();




