var gridBoard;
const playerScoreSpan = document.getElementById('playerScore');
const computerScoreSpan = document.getElementById('computerScore');
const cells = document.querySelectorAll('.cell');
const player = 'X';
const computer = 'O'; 
const winCombos = [
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8],
    [0, 4, 8], 
    [2, 4, 6], 
];
let options = ['', '', '', '', '', '', '', '', ''];
let restartBtn = document.querySelector('#btn');
let playerScore = 0;
let computerScore = 0;

document.addEventListener('DOMContentLoaded', () => {
    startGame();
})

function startGame() {
    cells.forEach(cell => cell.addEventListener('click', markOnClick));
    restartBtn.addEventListener('click', clearGame);
    document.querySelector('.endgame').style.display = 'none';
    gridBoard = Array.from(Array(9).keys());
}

function clearGame() {
    gridBoard = Array.from(Array(9).keys());
    options = ['', '', '', '', '', '', '', '', ''];

    cells.forEach(cell => {
        cell.innerText = '';
        cell.removeEventListener('click', markOnClick);
        cell.addEventListener('click', markOnClick);
    });
}

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
            updateScoreboard(currentPlayer);
            declareWinner(currentPlayer == player ? "YOU WIN" : "YOU LOST");
            return true;
        }
    }
    if(checkTie()) {
        return true;
    }
    
    updateScoreboard();
    return false;
}

function declareWinner(outcome) {
    const endgameOverlay = document.querySelector('.endgame');
    endgameOverlay.style.display = 'block';
    endgameOverlay.innerText = outcome;
    endgameOverlay.style.backgroundColor = 'rgba(33, 158, 188, 0.5)';
}

function checkTie() {
    if (options.every(cell => cell !== '')) {
        cells.forEach(cell => cell.removeEventListener('click', markOnClick, false));
        if(!checkWinner(gridBoard, player) && !checkWinner(gridBoard, computer)){
            declareWinner('DRAW');
        }
        return true;
    }
    return false;
}

function isGameActive() {
    return !checkWinner(gridBoard, player) && !checkWinner(gridBoard, computer) && !checkTie();
}

function updateScoreboard(playerWon) {
    if(playerWon === player) {
        playerScore++;
        playerScoreSpan.innerHTML = playerScore;
    } else if (playerWon === computer) {
        computerScore++;
        computerScoreSpan.innerHTML = computerScore;
    }
}