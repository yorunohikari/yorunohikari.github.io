const board = document.getElementById('board');
const status = document.getElementById('status');
const newGameButton = document.getElementById('newGameButton');
const cells = Array.from({ length: 9 }, () => null);
let currentPlayer = 'X';
let isGameOver = false;

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
        } else {
            status.textContent = `Player ${winner} wins!`;
        }
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
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

render();

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

newGameButton.addEventListener('click', resetGame);