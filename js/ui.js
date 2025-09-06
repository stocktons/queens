import { QueensGame } from "./queens.js";
import { templates } from "../templates.js";
import { codesToColors, squareSize } from "../utils.js";

class QueensGameUI {
  constructor() {
    this.game = null;
    this.board = null;
    this.title = null;
    this.startButton = null;
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
        square.style.backgroundColor =
          codesToColors[this.game.template[row][col][0]];
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
    title.classList.add("title");
    document.body.appendChild(title);
    return title;
  }

  getStartButton() {
    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", this.createGame.bind(this));
    document.body.appendChild(startButton);
    this.startButton = startButton;
    return startButton;
  }

  createGame() {
    this.startButton.innerText = "Reset Game";
    this.board?.remove();
    this.title?.remove();
    this.game = null;
    const randomIndex = Math.floor(Math.random() * templates.length);
    this.game = new QueensGame(templates[randomIndex]);
    this.title = this.createTitle();
    this.board = this.createBoard();
  }

  handleSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    if (this.game.getBoard()[row][col].includes("X") || this.game.getBoard()[row][col].includes("x")) {
      this.game.placeCrown(row, col);
    } else if (this.game.getBoard()[row][col].includes("C")) {
      this.game.removeCrown(row, col);
      this.game.removeX(row, col);
    } else {
      this.game.placeX(row, col);
    }
    this.updateHTMLBoard();
    if (this.game.checkForWin()) {
      console.log("you win!");
      // remove all click listeners
      const squares = this.board.querySelectorAll(".square");
      squares.forEach((square) => {
        square.removeEventListener("click", this.handleSquareClick);
      });
    }
  }

  updateHTMLBoard() {
    const updatedBoard = this.game.getBoard();
    for (let i = 0; i < updatedBoard.length; i++) {
      for (let j = 0; j < updatedBoard[i].length; j++) {
        const square = this.board.querySelector(
          `[data-row="${i}"][data-col="${j}"]`
        );
        if (updatedBoard[i][j].includes("C")) {
          square.innerHTML = "👑";
        } else if (updatedBoard[i][j].includes("X") || updatedBoard[i][j].includes("x")) {
          square.innerHTML = "X";
        } else {
          square.innerHTML = "";
        }
        if (updatedBoard[i][j].includes("Z")) {
          square.classList.add("error");
        }
        if (!updatedBoard[i][j].includes("Z")) {
          square.classList.remove("error");
        }
      }
    }
  }
}

window.addEventListener("load", () => {
  const gameUI = new QueensGameUI();
  gameUI.getStartButton();
});
