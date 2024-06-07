document.addEventListener('DOMContentLoaded', function() {
    // ----------------------- VARIABLES -----------------------
    const TRUE = "true";
    const FALSE = "false";

    const cellClass = "cell";

    const difficultyBeginner = "beginner";
    const difficultyIntermediate = "intermediate";
    const difficultyExpert = "expert";
    const difficultyCustom = "custom";
    let currentDifficulty = difficultyBeginner;

    let rows, cols, mines;
    let revealedNonMineCount = 0;
    let flaggedCount = 0;
    let firstClick = true;
    let gameEnded = false;
    let flagMode = false;

    const adjacentOffsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    // ----------------------- GAME SETUP -----------------------
    const minesweeperBoard = document.getElementById('game-board');
    initializeBoard(minesweeperBoard, currentDifficulty); // Default level
    window.addEventListener('resize', () => {resizeBoard(minesweeperBoard);});

    minesweeperBoard.addEventListener('click', handleLeftClick);
    minesweeperBoard.addEventListener('contextmenu', handleRightClick);

    document.getElementById('reset-button').addEventListener('click', () => resetBoard(currentDifficulty));
    document.getElementById('flag-toggle').addEventListener('click', toggleFlagMode);

    // Event listeners for difficulty buttons
    document.getElementById('beginner').addEventListener('click', () => changeDifficulty(difficultyBeginner));
    document.getElementById('intermediate').addEventListener('click', () => changeDifficulty(difficultyIntermediate));
    document.getElementById('expert').addEventListener('click', () => changeDifficulty(difficultyExpert));
    document.getElementById('custom').addEventListener('click', () => openCustomDifficultyModal());

    // Custom difficulty modal elements
    const customModal = document.getElementById('custom-difficulty-modal');
    const closeModalButton = document.getElementById('close-custom-settings');
    const confirmButton = document.getElementById('confirm-custom-settings');
    const customRowsInput = document.getElementById('custom-rows');
    const customColsInput = document.getElementById('custom-cols');
    const customMinesInput = document.getElementById('custom-mines');

    // Event listeners for custom difficulty modal
    closeModalButton.addEventListener('click', closeCustomDifficultyModal);
    confirmButton.addEventListener('click', setCustomDifficulty);
    customRowsInput.addEventListener('input', validateCustomSettings);
    customColsInput.addEventListener('input', validateCustomSettings);
    customMinesInput.addEventListener('input', validateCustomSettings);

    // ----------------------- GAME BOARD -----------------------
    function initializeBoard(board, difficulty) {
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;

        switch (difficulty) {
            case difficultyBeginner:
                rows = cols = 9;
                mines = 10;
                break;
            case difficultyIntermediate:
                rows = cols = 16;
                mines = 40;
                break;
            case difficultyExpert:
                if (viewportHeight > viewportWidth) {
                    rows = 30;
                    cols = 16;
                } else {
                    rows = 16;
                    cols = 30;
                }
                mines = 99;
                break;
            case difficultyCustom:
                // Rows, cols, and mines will be set through custom difficulty modal
                break;
        }

        setupBoardGrid(board, rows, cols);

        revealedNonMineCount = 0; // Reset the count
        flaggedCount = 0;
        updateMineCountDisplay();
        timer.resetTimerDisplay(); // Reset the timer display to zero
        firstClick = true; // Reset first click flag
        gameEnded = false;
        trackMove(); // Track initial board setup or reset state
    }

    function setupBoardGrid(board, rows, cols) {
        board.innerHTML = ''; // Clear previous board
        board.dataset.rows = rows;
        board.dataset.cols = cols;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add(cellClass);
                cell.dataset.row = row.toString();
                cell.dataset.col = col.toString();
                cell.dataset.mine = FALSE;
                cell.dataset.flagged = FALSE;
                cell.dataset.revealed = FALSE;
                cell.dataset.adjacentMines = "0";
                board.appendChild(cell);
            }
        }

        addFireworksContainer(board); // Add the fireworks container
        resizeBoard(board); // Ensure the board is sized correctly on load
    }

    function resizeBoard(board) {
        // Calculate column width and row height based on the viewport size
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const maxCellSize = 40; // Max cell size in pixels
        const gridPadding = 20; // Adjust based on your styling, accounting for both sides
        const headerHeight = 60; // Adjust if you have a header or want additional padding at the top
        const availableWidth = viewportWidth - gridPadding * 2; // Total available width for the grid
        const availableHeight = viewportHeight - headerHeight * 2 - gridPadding * 2; // Total available height for the grid

        let cellSize = Math.min(
            Math.floor(availableWidth / cols),
            Math.floor(availableHeight / rows),
            maxCellSize
        );

        // Set grid style dynamically based on calculated cell size
        board.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

        // Set cell sizes
        board.querySelectorAll('.cell').forEach(cell => {
            cell.style.width = cell.style.height = `${cellSize}px`;
        });
    }

    function resetBoard(difficulty) {
        initializeBoard(minesweeperBoard, difficulty);
    }

    // ----------------------- DIFFICULTY -----------------------
    function changeDifficulty(difficulty) {
        // Update the current difficulty
        currentDifficulty = difficulty;
        // Reinitialize the game with the new difficulty
        initializeBoard(minesweeperBoard, currentDifficulty);
    }

    function setCustomDifficulty() {
        rows = parseInt(customRowsInput.value);
        cols = parseInt(customColsInput.value);
        mines = parseInt(customMinesInput.value);
        currentDifficulty = difficultyCustom;
        closeCustomDifficultyModal();
        resetBoard(currentDifficulty);
    }

    function validateCustomSettings() {
        const rows = parseInt(customRowsInput.value);
        const cols = parseInt(customColsInput.value);
        const mines = parseInt(customMinesInput.value);
        const maxMines = (rows * cols) - 1;

        confirmButton.disabled = !(rows >= 9 && rows <= 30 && cols >= 9 && cols <= 30 && mines >= 10 && mines <= maxMines);
    }

    function openCustomDifficultyModal() {
        customModal.style.display = 'block';
    }

    function closeCustomDifficultyModal() {
        customModal.style.display = 'none';
    }

    // ----------------------- EVENTS -----------------------
    function handleLeftClick(event) {
        if (gameEnded) {
            return;
        }
        if (event.target.classList.contains(cellClass)) {
            const cell = event.target;
            if (flagMode) {
                if (cell.dataset.revealed === TRUE) {
                    checkAndRevealAdjacentCells(cell);
                } else {
                    toggleFlag(cell);
                }
            } else {
                if (firstClick) {
                    handleFirstClick(cell);
                } else if (cell.dataset.revealed === TRUE) {
                    checkAndRevealAdjacentCells(cell);
                } else {
                    revealCell(cell);
                }
            }
        }
        trackMove();
    }

    function handleFirstClick(cell) {
        placeMinesExcluding(cell);
        revealCell(cell);
        startTime = Date.now();
        // startTimer(); // Start the timer on the first click
        timer.startTimer();
        firstClick = false; // Set first click flag to false after first click
    }

    function handleRightClick(event) {
        event.preventDefault(); // Prevent the default context menu
        if (gameEnded) {
            return;
        }
        if (event.target.classList.contains(cellClass)) {
            const cell = event.target;
            if (flagMode) {
                // Do nothing or provide feedback that flagging is off
            } else {
                toggleFlag(cell);
            }
        }
        trackMove(); // Track initial board setup or reset state
    }

    // ----------------------- GAME LOGIC -----------------------
    function getCell(row, col) {
        return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    }

    function revealCell(cell) {
        if (cell.dataset.revealed === FALSE && cell.dataset.flagged === FALSE) {

            if (cell.dataset.mine === TRUE) {
                revealMine(cell);
            } else {
                cell.dataset.revealed = TRUE;
                revealedNonMineCount++;
                if (revealedNonMineCount === (rows * cols) - mines) {
                    victory();
                }
                if (cell.dataset.adjacentMines === "0") {
                    adjacentOffsets.forEach(([rOffset, cOffset]) => {
                        const r = parseInt(cell.dataset.row) + rOffset;
                        const c = parseInt(cell.dataset.col) + cOffset;
                        if (r >= 0 && r < rows && c >= 0 && c < cols) {
                            revealCell(getCell(r, c)); // Do not track during flood fill
                        }
                    });
                } else {
                    cell.textContent = cell.dataset.adjacentMines;
                }
            }
        }
    }

    function revealMine(cell) {
        cell.dataset.exploded = TRUE;
        cell.dataset.revealed = TRUE;
        gameOver();
    }

    function toggleFlag(cell) {
        if (cell.dataset.revealed === FALSE) {
            if (cell.dataset.flagged === TRUE) {
                cell.dataset.flagged = FALSE;
                flaggedCount--;
            } else if (flaggedCount < mines) {
                cell.dataset.flagged = TRUE;
                flaggedCount++;
            } else {
                console.log("Cannot add more flags, all mines are already flagged.");
            }
            updateMineCountDisplay();
        }
    }

    function checkAndRevealAdjacentCells(cell) {
        const adjacentFlags = countAdjacentFlags(cell);
        if (adjacentFlags === parseInt(cell.dataset.adjacentMines)) {
            adjacentOffsets.forEach(([rOffset, cOffset]) => {
                const r = parseInt(cell.dataset.row) + rOffset;
                const c = parseInt(cell.dataset.col) + cOffset;
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    const adjacentCell = getCell(r, c);
                    if (adjacentCell.dataset.flagged === FALSE) {
                        revealCell(adjacentCell);
                    }
                }
            });
        }
    }

    function victory() {
        console.log("Victory!");
        gameEnded = true;
        timer.stopTimer(); // Stop the timer on win
        flagAllNonFlaggedMines();
        flaggedCount = mines;
        updateMineCountDisplay();
        AudioManager.playSound("/audio/victory.mp3");
        startFireworks();
    }

    function gameOver() {
        console.log("Game Over")
        gameEnded = true;
        timer.stopTimer(); // Stop the timer on win
        revealAllMines();
        AudioManager.playSound("/audio/explosion.mp3");
    }

    function calculateAdjacentMines(rows, cols) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let mineCount = 0;
                adjacentOffsets.forEach(([rOffset, cOffset]) => {
                    const r = row + rOffset;
                    const c = col + cOffset;
                    if (r >= 0 && r < rows && c >= 0 && c < cols) {
                        const cell = getCell(r, c);
                        if (cell.dataset.mine === TRUE) {
                            mineCount++;
                        }
                    }
                });
                const cell = getCell(row, col);
                cell.dataset.adjacentMines = mineCount.toString();
            }
        }
    }

    function placeMinesExcluding(excludedCell) {
        const excludedRow = parseInt(excludedCell.dataset.row);
        const excludedCol = parseInt(excludedCell.dataset.col);
        let minesPlaced = 0;
        while (minesPlaced < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            if (row !== excludedRow || col !== excludedCol) {
                const cell = getCell(row, col);
                if (cell.dataset.mine === FALSE) {
                    cell.dataset.mine = TRUE;
                    minesPlaced++;
                }
            }
        }
        calculateAdjacentMines(rows, cols); // Update adjacent mines for the board
    }

    function countAdjacentFlags(cell) {
        let flagCount = 0;
        adjacentOffsets.forEach(([rOffset, cOffset]) => {
            const r = parseInt(cell.dataset.row) + rOffset;
            const c = parseInt(cell.dataset.col) + cOffset;
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                const adjacentCell = getCell(r, c);
                if (adjacentCell.dataset.flagged === TRUE) {
                    flagCount++;
                }
            }
        });
        return flagCount;
    }

    function toggleFlagMode() {
        flagMode = !flagMode;
        const flagToggleButton = document.getElementById('flag-toggle');
        if (flagMode) {
            flagToggleButton.textContent = "Flag";
        } else {
            flagToggleButton.textContent = "Reveal";
        }
    }

    function updateMineCountDisplay() {
        const mineCountElement = document.getElementById('mines-count');
        mineCountElement.textContent = (mines - flaggedCount).toString();
    }

    function revealAllMines() {
        const cells = document.querySelectorAll(`.${cellClass}`);
        cells.forEach(cell => {
            if (cell.dataset.mine === TRUE) {
                cell.dataset.revealed = TRUE;
            }
        });
    }

    function flagAllNonFlaggedMines() {
        const cells = document.querySelectorAll(`.${cellClass}`);
        cells.forEach(cell => {
            if (cell.dataset.mine === TRUE && cell.dataset.flagged === FALSE) {
                cell.dataset.flagged = TRUE;
            }
        });
    }

    // ----------------------- GAME STATE -----------------------
    function saveGameState() {
        const gameState = getGameState();
        localStorage.setItem('minesweeperGameState', JSON.stringify(gameState));
        return gameState;
    }

    function getGameState() {
        return {
            difficulty: currentDifficulty,
            rows,
            cols,
            mines,
            flaggedCount,
            revealedNonMineCount,
            gameEnded,
            firstClick,
            startTime,
            cells: Array.from(document.querySelectorAll('.cell')).map(cell => ({
                row: cell.dataset.row,
                col: cell.dataset.col,
                mine: cell.dataset.mine,
                flagged: cell.dataset.flagged,
                revealed: cell.dataset.revealed,
                adjacentMines: cell.dataset.adjacentMines,
                exploded: cell.dataset.exploded,
            })),
        };
    }

    function loadGameState(savedState) {
        if (savedState) {
            const gameState = JSON.parse(savedState);
            // Restore game state from the parsed object
            currentDifficulty = gameState.difficulty;
            rows = gameState.rows;
            cols = gameState.cols;
            mines = gameState.mines;
            flaggedCount = gameState.flaggedCount;
            revealedNonMineCount = gameState.revealedNonMineCount;
            gameEnded = gameState.gameEnded;
            firstClick = gameState.firstClick;
            startTime = gameState.startTime;
            // Set up the grid and restore cells
            setupBoardGrid(minesweeperBoard, rows, cols);
            gameState.cells.forEach(cellState => {
                const cell = getCell(cellState.row, cellState.col);
                Object.keys(cellState).forEach(key => {
                    cell.dataset[key] = cellState[key];
                });
                if (cellState.revealed === TRUE) {
                    if (cellState.adjacentMines !== "0") {
                        cell.textContent = cellState.adjacentMines;
                    }
                }
            });
            updateMineCountDisplay();
            // Restore timer
            if (!gameEnded && !firstClick) {
                if (startTime) {
                    // startTimer();
                    timer.startTimer();
                    timer.updateTimerDisplay();
                } else {
                    timer.resetTimerDisplay();
                    gameEnded = false;
                }
            } else {
                timer.resetTimerDisplay();
                gameEnded = false;
            }
        }
    }

    function trackMove() {
        const gameState = getGameState();
        history.pushState(gameState, null, ''); // Push the game state to the history stack
    }

    loadGameState(localStorage.getItem('minesweeperGameState'));
    window.addEventListener('beforeunload', saveGameState);

    // ----------------------- IMPORT & EXPORT OF GAME STATE -----------------------
    function importGameState(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                localStorage.setItem('minesweeperGameState', contents);
                loadGameState(contents);
                event.target.value = ''; // Reset the input value
            };
            reader.readAsText(file);
        }

    }

    function exportGameState() {
        saveGameState();
        const savedState = localStorage.getItem('minesweeperGameState');
        if (savedState) {
            const blob = new Blob([savedState], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'minesweeperGameState.json';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            console.log("No game state to export");
        }

    }

    // Attach event listeners
    document.getElementById('import-file').addEventListener('change', importGameState);
    document.getElementById('export-button').addEventListener('click', exportGameState);
    document.getElementById('import-button').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });

    // ----------------------- HISTORY -----------------------
    // Restore game state from history
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            loadGameState(JSON.stringify(event.state));
        }
    });
});
