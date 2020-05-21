'use strict'

const MARKED_MINE_IMAGE = `<img src="img/flagged.png" style="width: 15px; height: 15px">`;
const EMPTY_IMG = `<img src="img/empty.png" style="width: 15px; height: 15px">`;
const NEG_0_IMG = `<img src="img/0.png" style="width: 15px; height: 15px">`;
const NEG_1_IMG = `<img src="img/1.png" style="width: 15px; height: 15px">`;
const NEG_2_IMG = `<img src="img/2.png" style="width: 15px; height: 15px">`;
const NEG_3_IMG = `<img src="img/3.png" style="width: 15px; height: 15px">`;
const NEG_4_IMG = `<img src="img/4.png" style="width: 15px; height: 15px">`;
const NEG_5_IMG = `<img src="img/5.png" style="width: 15px; height: 15px">`;
const NEG_6_IMG = `<img src="img/6.png" style="width: 15px; height: 15px">`;
const NEG_7_IMG = `<img src="img/7.png" style="width: 15px; height: 15px">`;
const NEG_8_IMG = `<img src="img/8.png" style="width: 15px; height: 15px">`;

const MINE = "*";
const EMPTY = "";

// The Mine Board
var gBoard;
var gIntervalId;
var gElTimer = document.querySelector('.timer');
var gGame;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function init() {
    gGame = gGameInit();
    gElTimer.innerText = `Timer : ${gGame.secsPassed}`;
    gBoard = buildBoard();
    placeMines(gLevel.MINES);
    setMinesNegsCount(gBoard);
    renderBoard(); // present the mines
    if (gIntervalId) {
        clearInterval(gIntervalId);
        gGame.secsPassed = 0;
        gElTimer.innerText = gGame.secsPassed;
    }
}

function gGameInit() {
    var gGame = {
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gElTimer.innerText = `Timer : ${gGame.secsPassed}`;
    return gGame;
}
function buildBoard() {
    // build the board size * size
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell(i, j);
        }
    }
    return board;
}

function createCell(i, j) {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        char: EMPTY
    }
    return cell;
}

function placeMines(numOfMines) {

    for (var i = 0; i < numOfMines; i++) {
        var row = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var col = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var currMine = gBoard[row][col];
        // making sure currMine does overide prev mine
        while (currMine.isMine) {
            row = getRandomIntInclusive(0, gLevel.SIZE - 1);
            col = getRandomIntInclusive(0, gLevel.SIZE - 1);
            currMine = gBoard[row][col];
        }
        currMine.isMine = true;
        currMine.char = MINE;
    }
}

function renderBoard() {
    var cellClass;
    var cellValue;
    var strHTML = '';
    var size = gBoard.length;
    for (var i = 0; i < size; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < size; j++) {
            cellClass = getClassName({ i: i, j: j });
            var currCell = gBoard[i][j];

            // if cell is flaged marked 
            if (currCell.isMarked) {
                cellValue = MARKED_MINE_IMAGE;
                strHTML += `<td onclick="cellClicked(${i},${j}"  oncontextmenu="cellMarkedClicked(${i},${j})">
                ${cellValue}
                </td>`
                continue;
            }
            // if cell is shown
            if (currCell.isShown) {

                if (currCell.isMine) {
                    cellValue = MARKED_MINE_IMAGE;
                    strHTML += `<td onclick="cellClicked(${i},${j}"  oncontextmenu="cellMarkedClicked(${i},${j})">
                    ${cellValue}
                    </td>`
                    continue;

                } else {
                    if (currCell.minesAroundCount === 0) { cellValue = NEG_0_IMG; }
                    if (currCell.minesAroundCount === 1) { cellValue = NEG_1_IMG; }
                    if (currCell.minesAroundCount === 2) { cellValue = NEG_2_IMG; }
                    if (currCell.minesAroundCount === 3) { cellValue = NEG_3_IMG; }
                    if (currCell.minesAroundCount === 4) { cellValue = NEG_4_IMG; }
                    if (currCell.minesAroundCount === 5) { cellValue = NEG_5_IMG; }
                    if (currCell.minesAroundCount === 6) { cellValue = NEG_6_IMG; }
                    if (currCell.minesAroundCount === 7) { cellValue = NEG_7_IMG; }
                    if (currCell.minesAroundCount === 8) { cellValue = NEG_8_IMG; }

                    strHTML += `<td onclick="cellClicked(${i},${j}"  oncontextmenu="cellMarkedClicked(${i},${j})">
                    ${cellValue}
                    </td>` }

            } else if (!currCell.isMarked) {
                // if not shown and not marked , leave the cell as it is 
                currCell = EMPTY_IMG;
                strHTML += `<td onclick="cellClicked(${i},${j})" oncontextmenu="cellMarkedClicked(${i},${j});">${currCell}
                </td>`
            }
        }
        strHTML += '</tr>';
        var elTbody = document.querySelector('.table');
        elTbody.innerHTML = strHTML;
    }
}

function cellClicked(i, j) {
    var currCell = gBoard[i][j];

    // Start timer 
    if (gGame.secsPassed === 0) stratTimer();

    if (currCell.isShown) return;
    if (currCell.isMarked) return;



    currCell.isShown = true;

    //end of the game ; you lost!
    gGame.shownCount++;
    if (currCell.isMine) {
        currCell.isShown = true;
        // revealAllMines();
        var isWon = false;
        printEndOfGameMsg(isWon);

        // check if need to reveal negs around cell
    } else if (currCell.minesAroundCount === 0) revealNegs(i, j, gBoard);


    //check if game won
    if (checkGameOver()) {
        var isWon = true;
        printEndOfGameMsg(isWon);
    }

    console.log("gGame.shownCount:", gGame.shownCount)
    renderBoard();
}

function cellMarkedClicked(i, j) {
    var currCell = gBoard[i][j];

    // Start timer 
    if (gGame.secsPassed === 0) stratTimer();

    if (currCell.isShown) return;

    // handle marked counter
    currCell.isMarked = !currCell.isMarked;
    gGame.markedCount = currCell.isMarked ? gGame.markedCount + 1 : gGame.markedCount - 1;

    //check if game won
    if (checkGameOver()) {
        var isWon = true;
        printEndOfGameMsg(isWon);
    }
    renderBoard();
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gBoard.length; i++) {
        var row = gBoard[i];
        for (var j = 0; j < row.length; j++) {
            var MineNegsCount = getMineNegsCount(i, j, board);
            row[j].minesAroundCount = MineNegsCount;
        }
    }
}

function getMineNegsCount(cellI, cellJ, board) {
    var count = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) count++;
        }
    }
    return count;
}

function revealNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = gBoard[i][j];
            if (currCell.isMine === false && currCell.isShown === false) {
                currCell.isShown = true;
                gGame.shownCount++;
            }
        }
    }
}

function changeLevel(elInput) {
    switch (elInput.value) {
        case 'Beginner':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 'Medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case 'Expert':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;
    }
    init();
    gElTimer.innerText = `Timer : ${gGame.secsPassed}`;
}

function checkGameOver() {
    var sumCounts = gGame.markedCount + gGame.shownCount;
    if (sumCounts === gLevel.SIZE ** 2) return true;
    return false;
}

function printEndOfGameMsg(isWon) {
    if (isWon) {
        setTimeout(function () {
            if (confirm(`Well Done!\n
                It took you ${gGame.secsPassed} seconds to win!\n
                Do you want to play again?`)) init()
        }, 0)
    } else {
        setTimeout(function () {
            if (confirm(`You Lost!\n
                Do you want to play again?`)) init()
        }, 0)

    }

}

function stratTimer() {
    gIntervalId = setInterval(function () {
        gGame.secsPassed = gGame.secsPassed + 1;
        gElTimer.innerText = `Timer : ${gGame.secsPassed}`;
        gGame.secsPassed = parseInt(gGame.secsPassed);
    }, 1000);
}
