document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('word-search-grid');
    const wordListElement = document.getElementById('words');
    const messageArea = document.getElementById('message-area');

    // Lista de palavras para o caça-palavras
    const words = ['HTML', 'CSS', 'JAVASCRIPT', 'PROGRAMACAO', 'WEB', 'DESENVOLVIMENTO', 'CODIGO'];

    // Configurações do jogo
    const gridSize = 12;
    const grid = [];
    let selectedCells = [];
    let foundWords = [];

    // Função para criar a grade do caça-palavras
    function createGrid() {
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i;
            cell.addEventListener('mousedown', handleMouseDown);
            cell.addEventListener('mouseenter', handleMouseEnter);
            cell.addEventListener('mouseup', handleMouseUp);
            gridContainer.appendChild(cell);
            grid.push({ element: cell, letter: '' });
        }
    }

    // Função para preencher a grade com palavras
    function placeWords() {
        words.forEach(word => {
            let placed = false;
            while (!placed) {
                const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
                const startX = Math.floor(Math.random() * gridSize);
                const startY = Math.floor(Math.random() * gridSize);
                
                let canPlace = true;
                let cellsToPlace = [];

                for (let i = 0; i < word.length; i++) {
                    let nextX = startX;
                    let nextY = startY;

                    if (direction === 0) nextX += i;
                    if (direction === 1) nextY += i;
                    if (direction === 2) {
                        nextX += i;
                        nextY += i;
                    }
                    
                    if (nextX >= gridSize || nextY >= gridSize) {
                        canPlace = false;
                        break;
                    }

                    const index = nextY * gridSize + nextX;
                    if (grid[index].letter !== '' && grid[index].letter !== word[i]) {
                        canPlace = false;
                        break;
                    }
                    cellsToPlace.push(index);
                }

                if (canPlace) {
                    cellsToPlace.forEach((index, i) => {
                        grid[index].letter = word[i];
                        grid[index].element.textContent = word[i];
                    });
                    placed = true;
                }
            }
        });

        // Preencher o resto da grade com letras aleatórias
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        grid.forEach(cell => {
            if (cell.letter === '') {
                const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                cell.letter = randomLetter;
                cell.element.textContent = randomLetter;
            }
        });
    }

    // Função para exibir a lista de palavras
    function displayWordList() {
        words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.dataset.word = word;
            wordListElement.appendChild(li);
        });
    }

    // Lógica para seleção de células
    let isSelecting = false;
    let startCellIndex = null;

    function handleMouseDown(event) {
        isSelecting = true;
        startCellIndex = parseInt(event.target.dataset.index);
        selectedCells = [startCellIndex];
        event.target.classList.add('selected');
        document.body.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    function handleMouseEnter(event) {
        if (!isSelecting) return;
        const currentCellIndex = parseInt(event.target.dataset.index);
        
        // Lógica de seleção simples para horizontal/vertical
        const startX = startCellIndex % gridSize;
        const startY = Math.floor(startCellIndex / gridSize);
        const currentX = currentCellIndex % gridSize;
        const currentY = Math.floor(currentCellIndex / gridSize);

        // Limpa a seleção anterior
        grid.forEach(cell => cell.element.classList.remove('selected'));
        selectedCells = [];

        if (startX === currentX) { // Seleção vertical
            const minY = Math.min(startY, currentY);
            const maxY = Math.max(startY, currentY);
            for (let y = minY; y <= maxY; y++) {
                const index = y * gridSize + startX;
                grid[index].element.classList.add('selected');
                selectedCells.push(index);
            }
        } else if (startY === currentY) { // Seleção horizontal
            const minX = Math.min(startX, currentX);
            const maxX = Math.max(startX, currentX);
            for (let x = minX; x <= maxX; x++) {
                const index = startY * gridSize + x;
                grid[index].element.classList.add('selected');
                selectedCells.push(index);
            }
        } else { // Seleção diagonal
            const dx = Math.sign(currentX - startX);
            const dy = Math.sign(currentY - startY);
            const steps = Math.abs(currentX - startX);

            if (steps === Math.abs(currentY - startY)) {
                for (let i = 0; i <= steps; i++) {
                    const x = startX + i * dx;
                    const y = startY + i * dy;
                    const index = y * gridSize + x;
                    grid[index].element.classList.add('selected');
                    selectedCells.push(index);
                }
            } else {
                 grid[startCellIndex].element.classList.add('selected');
                 selectedCells = [startCellIndex];
            }
        }
    }

    function handleMouseUp() {
        isSelecting = false;
        startCellIndex = null;

        const selectedWord = selectedCells.map(index => grid[index].letter).join('');
        const reversedWord = selectedCells.map(index => grid[index].letter).reverse().join('');

        if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
            markWordAsFound(selectedWord);
        } else if (words.includes(reversedWord) && !foundWords.includes(reversedWord)) {
            markWordAsFound(reversedWord);
        } else {
            selectedCells.forEach(index => {
                grid[index].element.classList.remove('selected');
            });
        }
        selectedCells = [];
    }

    function markWordAsFound(word) {
        foundWords.push(word);
        messageArea.textContent = `Palavra encontrada: ${word}!`;

        const wordLi = document.querySelector(`#words li[data-word="${word}"]`);
        if (wordLi) {
            wordLi.classList.add('found');
        }

        selectedCells.forEach(index => {
            grid[index].element.classList.add('found');
            grid[index].element.classList.remove('selected');
        });

        if (foundWords.length === words.length) {
            messageArea.textContent = 'Parabéns, você encontrou todas as palavras!';
            messageArea.style.color = 'green';
        }
    }

    // Iniciar o jogo
    createGrid();
    placeWords();
    displayWordList();
});
