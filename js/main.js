'use strict'

const MINE_FLAG = "#";
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
        isOn: false,
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

            if (currCell.isMarked) {
                cellValue = MINE_FLAG;
                strHTML += `<td onclick="cellClicked(this,${i},${j})"  style="background-color: white;" oncontextmenu="cellMarkedClicked(this,${i},${j});">${cellValue}</td>`
            } else if (!currCell.isShown) {
                cellValue = EMPTY;
                strHTML += `<td onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarkedClicked(this,${i},${j});">${cellValue}</td>`
            } else {
                cellValue = currCell.isMine ? MINE_FLAG : currCell.minesAroundCount;
                strHTML += `<td onclick="cellClicked(this,${i},${j})" style="background-color: white;" oncontextmenu="cellMarkedClicked(this,${i},${j});">${cellValue}</td>`
            }
        }
        strHTML += '</tr>';
        var elTbody = document.querySelector('.table');
        elTbody.innerHTML = strHTML;
    }
    console.log('marked count:', gGame.markedCount);
    console.log('shown count:', gGame.shownCount);

}

function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j];

    if (gGame.secsPassed === 0) {
        gIntervalId = setInterval(function () {
            gGame.secsPassed = gGame.secsPassed + 1;
            gElTimer.innerText = `Timer : ${gGame.secsPassed}`;
            gGame.secsPassed = parseInt(gGame.secsPassed);
        }, 1000);
    }

    if (currCell.isShown) return;
    if (currCell.isMarked) return;

    if (currCell.isMine) {
        //end of the gmae ; you lost!
        console.log('you lost the game!')
    } else {
        currCell.isShown = true;
        gGame.shownCount++;
        revealNegs(i, j, gBoard);
        console.log(gGame.shownCount);
        if (checkGameOver()) {
            console.log('you won the game!') // todo: use confirm message 
        }
    }
    renderBoard();
}

function cellMarkedClicked(elCell, i, j) {
    var currCell = gBoard[i][j];
    console.log(currCell);
    if (gGame.secsPassed === 0) {
        gIntervalId = setInterval(function () {
            gGame.secsPassed = gGame.secsPassed + 1;
            gElTimer.innerText = `Timer : ${gGame.secsPassed}`;
            gGame.secsPassed = parseInt(gGame.secsPassed);
        }, 1000);
    }

    if (currCell.isShown) return;
    if (currCell.isMarked === false) {
        currCell.isMarked = true;
        gGame.markedCount++;
    } else {
        currCell.isMarked = false;
        gGame.markedCount--;
    }
    if (checkGameOver()) {
        console.log('you won the game!') // todo: use confirm message 
        init();
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

function changeLevel(elInput) { // Todo: time is restarted as well; not by cell click
    console.log(elInput)
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