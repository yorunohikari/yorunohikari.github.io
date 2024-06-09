const board = document.getElementById('board');
const status = document.getElementById('status');
const newGameButton = document.getElementById('newGameButton');
const gameModeSelect = document.getElementById('gameMode');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreDrawElement = document.getElementById('scoreDraw');

const cells = Array.from({ length: 9 }, () => null);
let currentPlayer = 'X';
let isGameOver = false;
let score = { X: 0, O: 0, Draw: 0 };
let gameMode = '2player';

gameModeSelect.addEventListener('change', () => {
    gameMode = gameModeSelect.value;
    resetGame();
});

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            isGameOver = true;
            markWinningCells([a, b, c]);
            return cells[a];
        }
    }

    if (cells.every(cell => cell !== null)) {
        isGameOver = true;
        return 'Draw';
    }

    return null;
}

function markWinningCells(winningIndices) {
    winningIndices.forEach(index => {
        const cellElement = document.querySelector(`#board .cell:nth-child(${index + 1})`);
        cellElement.classList.add('winner');
    });
}

function handleClick(index) {
    if (isGameOver || cells[index] !== null) {
        return;
    }

    cells[index] = currentPlayer;
    render();
    const winner = checkWinner();

    if (winner) {
        if (winner === 'Draw') {
            status.textContent = "It's a Draw!";
            score.Draw++;
            updateScore();
        } else {
            status.textContent = `Player ${winner} wins!`;
            score[winner]++;
            updateScore();
        }
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        if (gameMode === '1player' && currentPlayer === 'O') {
            setTimeout(computerMove, 500); // Add a delay for better user experience
        }
    }
}

function render() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleClick(index));
        board.appendChild(cellElement);
    });
}

function resetGame() {
    cells.fill(null);
    currentPlayer = 'X';
    isGameOver = false;
    status.textContent = "Player X's turn";
    clearWinningCells();
    render();
}

function clearWinningCells() {
    const winningCells = document.querySelectorAll('.cell.winner');
    winningCells.forEach(cell => cell.classList.remove('winner'));
}

function updateScore() {
    scoreXElement.textContent = `Player X: ${score.X}`;
    scoreOElement.textContent = `Player O: ${score.O}`;
    scoreDrawElement.textContent = `Draws: ${score.Draw}`;
}

function computerMove() {
    const bestMove = findBestMove(cells);
    handleClick(bestMove);
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';  // Computer's move
            const moveVal = minimax(board, 0, false);
            board[i] = null;

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const score = evaluateBoard(board);

    if (score === 10) return score - depth; // Maximize for faster win
    if (score === -10) return score + depth; // Minimize for faster loss
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, !isMaximizing));
                board[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, !isMaximizing));
                board[i] = null;
            }
        }
        return best;
    }
}

function evaluateBoard(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === 'O' ? 10 : -10;
        }
    }

    return 0;
}

function isBoardFull(board) {
    return board.every(cell => cell !== null);
}

newGameButton.addEventListener('click', resetGame);

render();
