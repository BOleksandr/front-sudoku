const board = document.getElementById("board");


function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < 81; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.className = "cell";
        input.dataset.index = i;
        input.oninput = () => {
            if (input.classList.contains("locked")) {
                input.value = input.dataset.value;
            } else {
                input.value = input.value.replace(/[^1-9]/g, '');
            }
        };
        board.appendChild(input);
    }
}



function clearBoard(){
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (!cell.classList.contains("locked")) {
            cell.value = '';
        }
        cell.classList.remove('invalid');
    });
}


function checkSolution() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    let isValid = true;
    cells.forEach(cell => cell.classList.remove('invalid'));

    const grid = [];
    for (let r = 0; r < 9; r++) {
        grid[r] = [];
        for (let c = 0; c < 9; c++) {
            grid[r][c] = cells[r * 9 + c].value; 
        }
    } 

    function markInvalid(r, c) {
        cells[r * 9 + c].classList.add('invalid');
        isValid = false;
    }

    for (let i = 0; i < 9; i++) {
        const row = new Set();
        const col = new Set();
        const box = new Set();
        for (let j = 0; j < 9; j++) {
            let rowVal = grid[i][j];
            if (rowVal && row.has(rowVal)) markInvalid(i, j);
            row.add(rowVal);

            let colVal = grid[j][i];
            if (colVal && col.has(colVal)) markInvalid(j, i);
            col.add(colVal);

            let boxRow = 3 * Math.floor(i / 3) + Math.floor(j / 3);
            let boxCol = 3 * (i % 3) + (j % 3);
            let boxVal = grid[boxRow][boxCol];
            if (boxVal && box.has(boxVal)) markInvalid(boxRow, boxCol);
            box.add(boxVal);
        }
    }

    if (isValid) {
        alert("Правильно")
    } else {
        alert("Неправильно!");
    }    
    
}


function generateSolvedGrid() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(''));

    function isSafe(row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] == num || grid[x][col] == num) return false;
        }
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (grid[startRow + r][startCol + c] == num) return false;
            }
        }
    return true;
    }

    function fillGrid(pos = 0) {
        if (pos === 81) return true;
        const row = Math.floor(pos / 9);
        const col = pos % 9;
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (let num of nums) {
            if (isSafe(row, col, num)) {
                grid[row][col] = num;
                if (fillGrid(pos + 1)) return true;
                grid[row][col] = '';
            }
        }
        return false;
    }

    fillGrid();
    return grid;
}

function generatePuzzle() {
    createBoard();
    const grid = generateSolvedGrid();

    const cells = document.querySelectorAll('.cell');
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const i = r * 9 + c;
            const cell = cells[i];
            if (Math.random() < 0.45) {
                cell.value = grid[r][c];
                cell.classList.add("locked");
                cell.dataset.value = grid[r][c];
            } else {
                cell.value = '';
            }
        }
    }
}

generatePuzzle();