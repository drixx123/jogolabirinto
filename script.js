const mazeEl = document.getElementById('maze');
const messageEl = document.getElementById('message');

const maze = [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'finish', 'wall']
];

let playerPosition = { row: 1, col: 1 };
const finishPosition = { row: 6, col: 8 };

function createMaze() {
    mazeEl.innerHTML = '';
    mazeEl.style.gridTemplateColumns = `repeat(${maze[0].length}, 30px)`;

    maze.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell', cell);
            if (rowIndex === playerPosition.row && colIndex === playerPosition.col) {
                cellDiv.classList.add('player');
            }
            if (rowIndex === finishPosition.row && colIndex === finishPosition.col) {
                cellDiv.classList.add('finish');
            }
            mazeEl.appendChild(cellDiv);
        });
    });
}

function updateMaze() {
    createMaze();
}

function checkWin() {
    if (playerPosition.row === finishPosition.row && playerPosition.col === finishPosition.col) {
        messageEl.textContent = 'Parabéns, você venceu!';
        messageEl.classList.remove('hidden');
        messageEl.classList.add('win');
        document.removeEventListener('keydown', handleKeydown);
    }
}

function handleKeydown(event) {
    let newRow = playerPosition.row;
    let newCol = playerPosition.col;

    switch (event.key) {
        case 'ArrowUp':
            newRow--;
            break;
        case 'ArrowDown':
            newRow++;
            break;
        case 'ArrowLeft':
            newCol--;
            break;
        case 'ArrowRight':
            newCol++;
            break;
    }

    if (newRow >= 0 && newRow < maze.length && newCol >= 0 && newCol < maze[0].length) {
        if (maze[newRow][newCol] !== 'wall') {
            playerPosition.row = newRow;
            playerPosition.col = newCol;
            updateMaze();
            checkWin();
        }
    }
}

document.addEventListener('keydown', handleKeydown);

// Inicializa o jogo
createMaze();