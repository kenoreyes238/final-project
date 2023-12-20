//variables
var gridBoard;
let restartBtn = document.querySelector('#btn');
const cells = document.querySelectorAll('.cell');
const player = 'X'; //player
const computer = 'O'; //computer/ AI
let options = ['', '', '', '', '', '', '', '', ''];
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

startGame();

//start game
function startGame() {
    cells.forEach(cell => cell.addEventListener('click', markOnClick));
    restartBtn.addEventListener('click', clearGame);
    document.querySelector('.endgame').style.display = 'none';
    gridBoard = Array.from(Array(9).keys());
}

//clear/ restart game
function clearGame() {
    gridBoard = Array.from(Array(9).keys());
    options = ['', '', '', '', '', '', '', '', ''];

    cells.forEach(cell => {
        cell.innerText = '';
    });

    cells.forEach(cell => cell.addEventListener('click', markOnClick));
}

//returns empty cells
function bestSpot() {
    const emptyCells = options.reduce((acc, value, index) => {
        if (value === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

function markOnClick(square) {
    const clickedCellId = square.target.id;

    if (!isGameActive() || typeof gridBoard[clickedCellId] !== 'number') {
        return;
    }

    turn(clickedCellId, player);

    // Check for a tie before the computer's move
    if (!checkTie() && isGameActive()) {
        setTimeout(() => {
            const computerMove = bestSpot();
            turn(computerMove, computer);
            checkTie();
        }, 500);
    }
}

function turn(squareId, currentPlayer) {
    if (options[squareId] !== '') {
        return;
    }

    gridBoard[squareId] = currentPlayer;

    document.getElementById(squareId).innerText = currentPlayer;
    options[squareId] = currentPlayer;

    if (checkWinner(gridBoard, currentPlayer)) {
        declareWinner(currentPlayer == player ? "YOU WIN" : "YOU LOST");
    }
}

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

function declareWinner(outcome, currentPlayer, computer) {
    const endgameOverlay = document.querySelector('.endgame');
    endgameOverlay.style.display = 'block';
    endgameOverlay.innerText = outcome;
    endgameOverlay.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
    
    //background for endgame got too lazy tbh
    // if (checkTie()) {
    //     endgameOverlay.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
    // } else if (checkWinner(gridBoard, currentPlayer)) {
    //     endgameOverlay.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
    // } else if (checkWinner(gridBoard, computer)) {
    //     endgameOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    // }
}

function checkTie() {
    if (options.every(cell => cell !== '')) {
        cells.forEach(cell => cell.removeEventListener('click', markOnClick, false));
        declareWinner('DRAW');
        return true;
    }
    return false;
}

function isGameActive() {
    return !checkWinner(gridBoard, player) && !checkWinner(gridBoard, computer) && !checkTie();
}