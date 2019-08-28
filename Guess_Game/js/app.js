

/* global scope variables*/
var scores, roundScore, activePlayer, gamePlaying;

init();

var lastDice;

/* function for when roll dice button is clicked */
document.querySelector('.btn-roll').addEventListener('click', function() {

    if(gamePlaying) {
        var dice1 = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1; /* Getting a random number from 0 to 6 which is not a decimal */

        /* showing two dices */
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';

         /* navigating to where the pictures are located */
        /* Using string concatenation to find the image with the random number from above */
        document.getElementById('dice-1').src = 'css/images/dice-' + dice1 + '.png';
        document.getElementById('dice-2').src = 'css/images/dice-' + dice2 + '.png';
       
        
        if (dice1 !== 1 && dice2 !== 1) {
            roundScore += dice1 + dice2 /* adding the value of the random dice to the score of the current player */
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } 
        else {
            nextPlayer();
    } 
       
  }

});

/* functionality of the hold button */
document.querySelector('.btn-hold').addEventListener('click', function() {

    if (gamePlaying) {
        scores[activePlayer] += roundScore; /* go into the scores array and add the current score of current player */
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer]; /*Display the global score for the current player */
        var newVal = document.querySelector('.final_score').value;
        console.log(newVal);
        var winningScore;
        /* if user gives us an input set it to winning score */
        if (newVal) {
                var winningScore = newVal;
        } else {
            winningScore = 100; /* if no user input set winningscore to 100 by default */
        }
        if (scores[activePlayer] >= winningScore) {
            document.querySelector('#name-' + activePlayer).textContent = "Winner!" /* Changing the panel title of correct winner */
            /* No dice display in the center */
            document.getElementById('dice-1').style.display ="none";
            document.getElementById('dice-2').style.display ="none";

            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active'); /* removes red dot which indicates which user is active */
            /* stopping the game completely beause we have a winner now */
            gamePlaying = false;
        }
        else {
            /* move on to next player */
            nextPlayer(); 
        }
  }
});

document.querySelector('.btn-new').addEventListener('click', init);

function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0; /* switch to a different user */
    roundScore = 0; /* starts the new user with a score of zero */

    /* when you hit 1 you loose the current score you had. Applies to both players */
    document.getElementById('current-0').textContent = '0'; 
    document.getElementById('current-1').textContent = '0';

    /* letting the user know which player is active */
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    
    document.getElementById('dice-1').style.display ="none";
    document.getElementById('dice-2').style.display ="none"; /* starting the new player with no dice image */
    
}



/* a function that initializes everything before the game start */

function init() {
    /* the first value is zero the second value is 1 */
    scores =[0,0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;

    document.getElementById('dice-1').style.display ="none";
    document.getElementById('dice-2').style.display ="none"; /* not showing the dice image when page first loads */
    /*Overall global score */
    document.getElementById('score-1').textContent = 0;
    document.getElementById('score-0').textContent = 0;
    /* Round/Current scores */
    document.getElementById('current-0').textContent = 0; 
    document.getElementById('current-1').textContent = 0;
    /* Resetting the titles back to Player 1 and Player 2 for the new game */
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    /* Removing styles from both player panels */
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    /* setting the active mode for player 1 on */
    document.querySelector('.player-0-panel').classList.add('active');


}