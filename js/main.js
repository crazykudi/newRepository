'use strict'

const MARKED_MINE_IMAGE = `<img src="img/flagged.png" style="width: 30px; height: 30px">`;
const BOMB_IMG = `<img src="img/bomb.png" style="width: 30px; height: 30px">`;
const EMPTY_IMG = `<img src="img/empty.png" style="width: 30px; height: 30px">`;
const NEG_0_IMG = `<img src="img/0.png" style="width: 30px; height: 30px">`;
const NEG_1_IMG = `<img src="img/1.png" style="width: 30px; height: 30px">`;
const NEG_2_IMG = `<img src="img/2.png" style="width: 30px; height: 30px">`;
const NEG_3_IMG = `<img src="img/3.png" style="width: 30px; height: 30px">`;
const NEG_4_IMG = `<img src="img/4.png" style="width: 30px; height: 30px">`;
const NEG_5_IMG = `<img src="img/5.png" style="width: 30px; height: 30px">`;
const NEG_6_IMG = `<img src="img/6.png" style="width: 30px; height: 30px">`;
const NEG_7_IMG = `<img src="img/7.png" sstyle="width: 30px; height: 30px">`;
const NEG_8_IMG = `<img src="img/8.png" style="width: 30px; height: 30px">`;
const EXPLODED_IMG = `<img src="img/exploded.png" style="width: 30px; height: 30px">`;
const FALSE_FLAGED_IMG = `<img src="img/false_flaged.png" style="width: 30px; height: 30px">`;
const SMILE_WON_IMG = `<img src="img/smile_won.png" style="width: 30px; height: 30px">`;

var gMinutesLabel = document.getElementById("minutes");
var gSecondsLabel = document.getElementById("seconds");

// The Mine Board
var gBoard;
var gIntervalId = 0;
var gGame;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function init() {
    gGame = gameInit();
    gBoard = buildBoard();
    gGame.isOn = true;
    renderBoard();
    if (gIntervalId) {
        stopTimer();
        gGame.secsPassed = 0;
        gSecondsLabel.innerHTML = "00";
        gMinutesLabel.innerHTML = "00";
    }
    document.getElementById("img").src = "img/smile.png";
    restartLives();
}

function stopTimer(isWon) {

    var src = isWon ? "img/smile_won.png" : "img/sad.png";
    document.getElementById("img").src = src;

    clearInterval(gIntervalId);

}

function gameInit() {
    var gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        numOfLives: 3
    }

    return gGame;
}
function buildBoard() {
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
        isMarked: false
    }
    return cell;
}

function placeMines(numOfMines, cellI, cellJ) {
    for (var i = 0; i < numOfMines; i++) {
        var row = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var col = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var currMine = gBoard[row][col];
        // making sure currMine does not overide prev mine
        while (currMine.isMine || (row === cellI && col === cellJ)) {
            row = getRandomIntInclusive(0, gLevel.SIZE - 1);
            col = getRandomIntInclusive(0, gLevel.SIZE - 1);
            currMine = gBoard[row][col];
        }
        currMine.isMine = true;
    }
}

function renderBoard() {
    var cellValue;
    var strHTML = '';
    var size = gBoard.length;
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            var cellId = `cell-${i}-${j}`;
            // if cell is flaged marked 
            if (currCell.isMarked) {
                cellValue = MARKED_MINE_IMAGE;
                strHTML += `<td id="${cellId}" onclick="cellClicked(${i},${j}"  oncontextmenu="cellMarkedClicked(${i},${j})">
                ${cellValue}
                </td>`
                continue;
            }
            // if cell is shown
            if (currCell.isShown) {

                if (currCell.isMine) {
                    cellValue = currCell.isShown ? BOMB_IMG : MARKED_MINE_IMAGE;

                    strHTML += `<td id="${cellId}" onclick="cellClicked(${i},${j}"  oncontextmenu="cellMarkedClicked(${i},${j})">
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

                }

            } else if (!currCell.isMarked) {
                // if not shown and not marked , leave the cell as it is 
                cellValue = EMPTY_IMG;
            }
            strHTML += `<td id="${cellId}" onclick="cellClicked(${i},${j})" oncontextmenu="cellMarkedClicked(${i},${j});">${cellValue}</td>`
        }
        strHTML += '</tr>';
        var elTbody = document.querySelector('.table');
        elTbody.innerHTML = strHTML;
    }
}

function cellClicked(i, j) {

    if (!gGame.isOn) return;

    if (gGame.secsPassed === 0) {
        startTimer();
        gGame.secsPassed++;
        placeMines(gLevel.MINES, i, j);
        setMinesNegsCount(gBoard);
    }

    var currCell = gBoard[i][j];
    if (currCell.isShown) return;
    if (currCell.isMarked) return;

    currCell.isShown = true;
    gGame.shownCount++;

    if (currCell.isMine) {
        var elLives = document.querySelectorAll('.lives img');
        if (gGame.numOfLives > 1) {
            gGame.numOfLives--;
            elLives[gGame.numOfLives].style.visibility = 'hidden';
            currCell.isShown = false;
            gGame.shownCount--;

            return;
        }

        //end of the game ; you lost!
        reveralMines();
        renderBoard();
        // change curr cell icon to rxploded bomb and show itin the board
        renderCellImg(i, j, EXPLODED_IMG);
        revealFalseMines();
        gGame.isOn = false;
        stopTimer();
        return;

        // check if need to reveal negs around cell
    } else if (currCell.minesAroundCount === 0) {
        expandShown(i, j, gBoard);
        console.log('shown count: ', gGame.shownCount)
    }
    //check if game won
    if (checkGameOver()) {
        gGame.isOn = false;
        var isWon = true;
        stopTimer(isWon);
        renderBoard();
        return;
    }
    renderBoard();
}

function cellMarkedClicked(i, j) {
    if (!gGame.isOn) return;
    if (gGame.secsPassed === 0) {
        startTimer();
        gGame.secsPassed++;
        placeMines(gLevel.MINES, i, j);
        setMinesNegsCount(gBoard);
    }

    var currCell = gBoard[i][j];
    if (currCell.isShown) return;

    // handle marked counter
    currCell.isMarked = !currCell.isMarked;
    gGame.markedCount = currCell.isMarked ? gGame.markedCount + 1 : gGame.markedCount - 1;

    //check if game won
    if (checkGameOver()) {
        gGame.isOn = false;
        var isWon = true;
        stopTimer(isWon);
        renderBoard();
        return;
    }
    renderBoard();
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
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
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) count++;
        }
    }
    return count;
}

function expandShown(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = gBoard[i][j];
            if (currCell.isMine === false && currCell.isShown === false) {
                currCell.isShown = true;
                gGame.shownCount++;
                if (currCell.minesAroundCount === 0) expandShown(i, j, gBoard);
            }
        }
    }
}

function changeLevel(elInput, size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    init();
}

function checkGameOver() {
    var sumCounts = gGame.markedCount + gGame.shownCount;
    if (sumCounts === gLevel.SIZE ** 2) return true;
    return false;
}

function startTimer() {
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    gGame.secsPassed = 0;
    gIntervalId = setInterval(function () {
        gGame.secsPassed = gGame.secsPassed + 1;
        secondsLabel.innerHTML = pad(gGame.secsPassed % 60);
        minutesLabel.innerHTML = pad(parseInt(gGame.secsPassed / 60));
    }, 1000);
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function reveralMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        }
    }
}

function revealFalseMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && currCell.isMarked) {
                renderCellImg(i, j, FALSE_FLAGED_IMG);
            }
        }
    }
}

function renderCellImg(cellI, cellJ, img) {
    var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
    elCell.innerHTML = img;
}

function restartLives() {
    var elLives = document.querySelectorAll('.lives img');
    for (var i = 0; i < elLives.length; i++) {
        elLives[i].style.visibility = '';
    }
}