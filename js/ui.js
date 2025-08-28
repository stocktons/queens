import { QueensGame } from "./queens.js";
import { templates } from "../templates.js";
import { codesToColors, squareSize } from "../utils.js";

class QueensGameUI {
  constructor() {
    this.game = null;
  }

  createBoard() {
    const board = document.createElement("div");
    board.classList.add("board");

    // Set CSS Grid properties to match template dimensions
    board.style.display = "grid";
    board.style.gridTemplateColumns = `repeat(${this.game.template[0].length}, ${squareSize})`;
    board.style.gap = "0";
    board.style.columnGap = "0";
    board.style.rowGap = "0";

    for (let row = 0; row < this.game.template.length; row++) {
      for (let col = 0; col < this.game.template[row].length; col++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.dataset.row = row;
        square.dataset.col = col;
        square.style.backgroundColor = codesToColors[this.game.template[row][col][0]];
        square.addEventListener("click", this.handleSquareClick.bind(this));
        board.appendChild(square);
      }
    }
    document.body.appendChild(board);
    return board;
  }

  createTitle() {
    const title = document.createElement("h1");
    title.textContent = `Game ${this.game.gameNumber}`;
    document.body.appendChild(title);
  }

  getStartButton() {
    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", this.createGame.bind(this));
    document.body.appendChild(startButton);
  }

  createGame() {
    const randomIndex = Math.floor(Math.random() * templates.length);
    this.game = new QueensGame(templates[randomIndex]);
    this.title = this.createTitle();
    this.board = this.createBoard();
  }

  handleSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    if (this.game.template[row][col].includes("X")) {
      this.game.placeCrown(row, col);
    } else if (this.game.template[row][col].includes("C")) {
      this.game.removeCrown(row, col);
    } else {
      this.game.placeX(row, col);
    }
    this.updateHTMLBoard();
  }

  updateHTMLBoard() {
    const updatedBoard = this.game.getBoard();
    for (let i = 0; i < updatedBoard.length; i++) {
      for (let j = 0; j < updatedBoard[i].length; j++) {
        const square = this.board.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        square.classList.remove("error");
        if (updatedBoard[i][j].includes("C")) {
          square.innerHTML = "👑";
        } else if (updatedBoard[i][j].includes("X")) {
          square.innerHTML = "X";
        } else if (updatedBoard[i][j].includes("Z")) {
          square.classList.add("error");
        } else {
          square.innerHTML = "";
        }
      }
    }
  }
}

window.addEventListener("load", () => {
  const gameUI = new QueensGameUI();
  gameUI.getStartButton();
});
