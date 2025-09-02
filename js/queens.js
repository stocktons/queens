export class QueensGame {
  constructor(templateInfo) {
    console.log("creating game", templateInfo);
    this.template = templateInfo.template;
    this.gameNumber = templateInfo.gameNumber;
    this.history = [];
    this.addToHistory(this.template);
  }

  getBoard() {
    return this.history[this.history.length - 1];
  }

  getColorSquares(color) {
    // return coords of all squares of a given color
    const squares = [];
    for (let row = 0; row < this.template.length; row++) {
      for (let col = 0; col < this.template[row].length; col++) {
        if (this.template[row][col] === color) {
          squares.push([row, col]);
        }
      }
    }
    return squares;
  }

  getCornerSquares(row, col) {
    // return coords of all squares on the corners of a given square
    const cornerSquares = [];
    const directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    for (const [dx, dy] of directions) {
      const foundX = row + dx;
      const foundY = col + dy;
      if (
        foundX >= 0 &&
        foundX < this.template.length &&
        foundY >= 0 &&
        foundY < this.template[0].length
      ) {
        cornerSquares.push([foundX, foundY]);
      }
    }
    return cornerSquares;
  }

  getRowAndColumnSquares(row, col) {
    const rowAndColumnSquares = [];
    for (let i = 0; i < this.template.length; i++) {
      if (i !== row) {
        rowAndColumnSquares.push([i, col]);
      }
    }
    for (let i = 0; i < this.template[0].length; i++) {
      if (i !== col) {
        rowAndColumnSquares.push([row, i]);
      }
    }
    return rowAndColumnSquares;
  }

  getHistory() {
    return this.history;
  }

  addToHistory(snapshot) {
    this.history.push(snapshot);
  }

  removeFromHistory() {
    this.history.pop();
  }

  placeX(row, col) {
    if (!this.getBoard()[row][col].includes("C")) {
      const newBoard = structuredClone(this.getBoard());
      newBoard[row][col] = newBoard[row][col][0] + "X";
      this.addToHistory(newBoard);
    }
  }

  placeCrown(row, col) {
    const info = this.getBoard()[row][col];
    console.log("info in placeCrown", info);
    if (!info.includes("X")) return;
    const newBoard = structuredClone(this.getBoard());
    this.checkForConflictingCrown(row, col, newBoard);
    console.log("newBoard in placeCrown", newBoard);
    newBoard[row][col] = info[0] + "C";
    this.fillAroundCrown(row, col, newBoard);
    console.log("newBoard in placeCrown after fillAroundCrown", newBoard);
    const sameColorSquares = this.getColorSquares(info[0]);
    for (const [sameColorRow, sameColorCol] of sameColorSquares) {
      if (!newBoard[sameColorRow][sameColorCol].includes("C")) {
        newBoard[sameColorRow][sameColorCol] =
          newBoard[sameColorRow][sameColorCol] + "X";
      }
    }
    this.addToHistory(newBoard);
  }

  removeCrown(row, col) {
    this.removeFromHistory();
  }

  removeX(row, col) {
    const newBoard = structuredClone(this.getBoard());
    newBoard[row][col] = newBoard[row][col].replace("X", "");
    this.addToHistory(newBoard);
  }

  checkForConflictingCrown(row, col, board) {
    const squaresToCheck = this.getCornerSquares(row, col).concat(
      this.getRowAndColumnSquares(row, col)
    );
    let rowToError;
    let colToError;
    for (const [squareRow, squareCol] of squaresToCheck) {
      if (board[squareRow][squareCol].includes("C")) {
        console.log(`found a crown at row ${squareRow} col ${squareCol}`);
        // add error to all squares in the row or column
        if (row === squareRow) {
          rowToError = row;
          break;
        } else if (col === squareCol) {
          colToError = col;
          break;
        }
      }
    }
    if (rowToError !== undefined) {
      for (let i = 0; i < this.template[0].length; i++) {
        board[row][i] = board[row][i].concat("Z");
      }
    }
    if (colToError !== undefined) {
      for (let i = 0; i < this.template.length; i++) {
        board[i][col] = board[i][col].concat("Z");
      }
    }
  }

  fillAroundCrown(row, col, board) {
    const cornerSquares = this.getCornerSquares(row, col);
    for (const [cornerRow, cornerCol] of cornerSquares) {
      board[cornerRow][cornerCol] = board[cornerRow][cornerCol] + "X";
    }
    const rowAndColumnSquares = this.getRowAndColumnSquares(row, col);
    for (const [rowAndColumnRow, rowAndColumnCol] of rowAndColumnSquares) {
      board[rowAndColumnRow][rowAndColumnCol] =
        board[rowAndColumnRow][rowAndColumnCol] + "X";
    }
  }

  checkForWin() {
    const board = this.getBoard();
    // check that every row contains exactly one crown and no square has "Z"
    return board.every((row) => row.filter((square) => square.includes("C")).length === 1 && !row.some((square) => square.includes("Z")));
  }
}
