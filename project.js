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
let cells = document.querySelectorAll('.cell');
let options = ['','','','','','','','',''];
let running = false;
const player = 'X'; //player
const computer = 'O'; //computer/ AI

startGame();

//start game
function startGame() {
    cells.forEach(cell => cell.addEventListener('click', markOnClick));
    restartBtn.addEventListener('click', clearGame);
    document.querySelector('.endgame').style.display = 'none';
    gridBoard = Array.from(Array(9).keys());
    running = true;
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
    return options;
}

//place a marker when player clicks on grid cell / input
function markOnClick(square) {
    if(typeof gridBoard[square.target.id] == 'number') {
        turn(square.target.id, player);
        if(!checkTie()) turn(bestSpot(), computer);
    } 
}

function turn(squareId, player){
    gridBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWinner(gridBoard, player);
}

//determine if player wins
function checkWinner(gameWon) {
    let gameWon = false;

    for(let i = 0; i < winCombos.length; i++) {
        const condition = winCombos[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == '' || cellB == '' || cellC == '') {
            continue;
        }
        if(cellA == cellB && cellB == cellC) {
            gameWon = true;
            break;
        }
    }
    declareWinner(gameWon.player == player ? "YOU WIN" : "YOU LOST");
}

//checks if there's a tie
function checkTie() {
    if(options.length == 0) {
        for(let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', markOnClick, false);
        }
        declareWinner('Draw');
        return true;
    }
    return false;
}

//display
function declareWinner() {
    document.querySelector('.endgame').style.display = 'block';
}