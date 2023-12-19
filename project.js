//make winning combos in an array
const winCombos = [
    [0, 3, 6], //vertical first column
    [1, 4, 7], //vertical second column
    [2, 5, 8], //vertical third column
    [0, 1, 2], //horizontal first row
    [3, 4, 5], //horizontal second row
    [6, 7, 8], //horizontal third row
    [0, 4, 8], //diagonal from top left to bottom right
    [2, 4, 6], //diagonal from bottom left to top right
];

var gridBoard;
let restartBtn = document.querySelector('#btn');
const cells = document.querySelectorAll('.cell');
const player = 'X'; //player
const computer = 'O'; //computer/ AI
let options = ['', '', '', '', '', '', '', '', ''];

startGame();

//start game
function startGame() {
    cells.forEach(cell => cell.addEventListener('click', markOnClick));
    restartBtn.addEventListener('click', clearGame);
    document.querySelector('.endgame').style.display = 'none';
    gridBoard = Array.from(Array(9).keys());
}

//display
function declareWinner(outcome) {
    const endgameOverlay = document.querySelector('.endgame');
    endgameOverlay.style.display = 'block';
    endgameOverlay.innerText = outcome;

    setTimeout(() => {
        endgameOverlay.style.display = 'none';
    }, 2000);
}

//clear/ restart game
function clearGame() {
    document.getElementById('0').innerHTML = '';
    document.getElementById('1').innerHTML = '';
    document.getElementById('2').innerHTML = '';
    document.getElementById('3').innerHTML = '';
    document.getElementById('4').innerHTML = '';
    document.getElementById('5').innerHTML = '';
    document.getElementById('6').innerHTML = '';
    document.getElementById('7').innerHTML = '';
    document.getElementById('8').innerHTML = '';
}

//returns empty cells
function bestSpot() {
    const emptyCells = options.reduce((acc, value, index) => {
        if (value === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    // Choose a random empty cell for the computer's move
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

//place a marker when player clicks on grid cell / input
function markOnClick(square) {
    if (typeof gridBoard[square.target.id] == 'number') {
        // Update the internal game state
        turn(square.target.id, player);

        // Check for a tie before the computer's move
        if (!checkTie()) {
            // Trigger the computer's move after a brief delay
            setTimeout(() => {
                // Update the internal game state for the computer's move
                turn(bestSpot(), computer);
                checkTie();
            }, 500); // Adjust the delay time (in milliseconds) as needed
        }
    }
}

function turn(squareId, currentPlayer) {
    // Update the internal game state
    gridBoard[squareId] = currentPlayer;

    // Update the displayed markings
    document.getElementById(squareId).innerText = currentPlayer;

    if (checkWinner(gridBoard, currentPlayer)) {
        declareWinner(currentPlayer == player ? "YOU WIN" : "YOU LOST");
    }
}

//determine if player wins
function checkWinner(gameBoard, currentPlayer) {
    for (let i = 0; i < winCombos.length; i++) {
        const condition = winCombos[i];
        const cellA = gameBoard[condition[0]];
        const cellB = gameBoard[condition[1]];
        const cellC = gameBoard[condition[2]];

        if (cellA == '' || cellB == '' || cellC == '') {
            continue;
        }
        if (cellA == cellB && cellB == cellC) {
            return true;
        }
    }
    return false;
}

//checks if there's a tie
function checkTie() {
    if (options.every(cell => cell !== '')) {
        cells.forEach(cell => cell.removeEventListener('click', markOnClick, false));
        declareWinner('Draw');
        return true;
    }
    return false;
}