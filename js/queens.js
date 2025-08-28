export class QueensGame {
  constructor(templateInfo) {
    console.log("creating game", templateInfo);
    this.template = templateInfo.template;
    this.gameNumber = templateInfo.gameNumber;
  }

  getBoard() {
    return this.template;
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

  placeX(row, col) {
    this.template[row][col] = this.template[row][col][0] + "X";
  }

  placeCrown(row, col) {
    const info = this.template[row][col];
    if (!info.includes("X")) return;
    this.template[row][col] = info[0] + "C";
    this.fillAroundCrown(row, col);
    const sameColorSquares = this.getColorSquares(info[0]);
    for (const [sameColorRow, sameColorCol] of sameColorSquares) {
      this.template[sameColorRow][sameColorCol] =
        this.template[sameColorRow][sameColorCol][0] + "X";
    }
  }

  removeCrown(row, col) {
    const info = this.template[row][col];
    this.template[row][col] = info[0];
    this.emptyAroundCrown(row, col);
  }

  checkIfCrown(row, col) {
    const squaresToCheck = this.getCornerSquares(row, col).concat(
      this.getRowAndColumnSquares(row, col)
    );
    for (const [squareRow, squareCol] of squaresToCheck) {
      if (this.template[squareRow][squareCol].includes("C")) {
        // add error to all squares in the row or column
        if (row === squareRow) {
          for (let i = 0; i < this.template[0].length; i++) {
            this.template[row][i] = this.template[row][i].concat("Z");
          }
        } else if (col === squareCol) {
          for (let i = 0; i < this.template.length; i++) {
            this.template[i][col] = this.template[i][col].concat("Z");
          }
        }
      }
    }
    return false;
  }

  fillAroundCrown(row, col) {
    const cornerSquares = this.getCornerSquares(row, col);
    for (const [cornerRow, cornerCol] of cornerSquares) {
      this.template[cornerRow][cornerCol] =
        this.template[cornerRow][cornerCol][0] + "X";
    }
    const rowAndColumnSquares = this.getRowAndColumnSquares(row, col);
    for (const [rowAndColumnRow, rowAndColumnCol] of rowAndColumnSquares) {
      this.template[rowAndColumnRow][rowAndColumnCol] =
        this.template[rowAndColumnRow][rowAndColumnCol][0] + "X";
    }
  }

  emptyAroundCrown(row, col) {
    const cornerSquares = this.getCornerSquares(row, col);
    for (const [cornerRow, cornerCol] of cornerSquares) {
      this.template[cornerRow][cornerCol] =
        this.template[cornerRow][cornerCol][0];
    }
    const rowAndColumnSquares = this.getRowAndColumnSquares(row, col);
    for (const [rowAndColumnRow, rowAndColumnCol] of rowAndColumnSquares) {
      this.template[rowAndColumnRow][rowAndColumnCol] =
        this.template[rowAndColumnRow][rowAndColumnCol][0];
    }
  }
}
