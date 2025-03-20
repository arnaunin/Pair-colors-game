import { shuffleArray } from "../utils/utils.js";

import Box from "./box";
import Timer from "./timer";


class Game {
  #rows;
  #cols;
  #idElement;
  #boxes;
  element;
  timer;

  constructor(rows, cols, idElement = "game") {
    this.#rows = rows;
    this.#cols = cols;
    this.#idElement = idElement;
    this.element = document.getElementById(idElement);
    this.#boxes = [];
    this.createBoxes();
    this.paintBoxes();

    this.element.addEventListener("click", () => {
      this.checkOpenBoxes();
    });

    this.initTimer();
  }

  get cols() {
    return this.#cols;
  }

  get rows() {
    return this.#rows;
  }

  checkOpenBoxes() {
    // Comprobamos si ya hay más de 1 caja abierta
    let nOpenBoxes = this.#boxes.filter((box) => box.open && box.free);
    if (nOpenBoxes.length == 2) {
      if (nOpenBoxes[0].color === nOpenBoxes[1].color) {
        nOpenBoxes.map((box) => {
          box.free = false;
        });
        this.arrayBoxesToLocalStorage();
      } else {
        setTimeout(() => {
          nOpenBoxes.map((box) => {
            box.resetColor();
          });
        }, 500);
      }
    } else {
        this.arrayBoxesToLocalStorage();
    }
    this.checkFinishGame();
  }

  checkFinishGame() {
    let freeBoxes = this.#boxes.filter((box) => box.free);
    if (freeBoxes.length === 0) {
      setTimeout(() => {
        this.timer.stop();
        localStorage.setItem('finalTime', JSON.stringify(this.timer.getTime()));
        alert('YOU WIN!');
      }, 50);
    }
  }

  createRandomColors() {
    let randomColors = [];
    for (let index = 0; index < (this.#cols * this.#rows) / 2; index++) {
      let red = Math.floor(Math.random() * 256);
      let green = Math.floor(Math.random() * 256);
      let blue = Math.floor(Math.random() * 256);
      let color = `rgb(${red}, ${green}, ${blue})`;
      randomColors.push(color);
    }
    randomColors = [...randomColors, ...randomColors];
    shuffleArray(randomColors);
    return randomColors;
  }

  createBoxes() {
    this.#boxes = [];
    // Si hay datos en LocalStorage, las genero desde ahí, si no, las genero normalmente
    if (localStorage.getItem("boxes") !== null) {
        let boxesFromLocalStorage = JSON.parse(localStorage.getItem("boxes"));
        boxesFromLocalStorage.map((box) => {
            let newBox = new Box(box.row, box.col, box.color, box.free, box.open);
            this.#boxes.push(newBox);
        });
    } else {
        let randomColors = this.createRandomColors();
        for (let row = 0; row < this.#rows; row++) {
          for (let col = 0; col < this.#cols; col++) {
            let color = randomColors.shift();
            let newBox = new Box(row, col, color);
            this.#boxes.push(newBox);
          }
        }
        this.arrayBoxesToLocalStorage();
    }

  }

  arrayBoxesToLocalStorage() {
    let arrayBoxesToLocalStorage = this.#boxes.map((box) => {
      return {
        row: box.row,
        col: box.col,
        color: box.color,
        free: box.free,
        open: box.open,
      }
    });
    localStorage.setItem("boxes", JSON.stringify(arrayBoxesToLocalStorage));
  }

  paintBoxes() {
    let header = document.createElement("header");
    header.setAttribute("id", "boxHeader");

    this.element.appendChild(header);

    let boxContainer = document.createElement("div");
    boxContainer.setAttribute("id", "boxContainer");
    this.element.appendChild(boxContainer);

    this.setCSSBoxTemplates();
    this.#boxes.map((box) => {
      let newBoxDiv = document.createElement("div");
      newBoxDiv.classList.add("box");
      if (!box.free || box.open) {
        newBoxDiv.style.backgroundColor = box.color;
      }
      box.element = newBoxDiv;
      box.addEventClick();
      boxContainer.appendChild(newBoxDiv);
    });
  }

  initTimer() {
    let timerContainer = document.createElement("h2");
    timerContainer.setAttribute("id", "timerContainer");
    timerContainer.innerHTML = '<span id="timer">00:00:00</span>';
    
    let header = document.getElementById("boxHeader");
    header.appendChild(timerContainer);
    this.timer = new Timer();
    this.timer.start();
  }

  setCSSBoxTemplates() {
    let boxContainer = document.getElementById("boxContainer");
    boxContainer.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    boxContainer.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
  }

  static getRowsCols() {
    let rows, cols;

    if (localStorage.getItem("rows") !== null && localStorage.getItem("cols") !== null) {
      rows = parseInt(localStorage.getItem("rows"));
      cols = parseInt(localStorage.getItem("cols"));
    } else {
      rows = parseInt(prompt("Enter the number of rows"));
      cols = parseInt(prompt("Enter the number of columns"));
      while ((rows * cols) % 2 !== 0 || (rows <= 0 || cols <= 0) || (isNaN(rows) || isNaN(cols)) || (rows > 50 || cols > 50)) {
        alert(
          "The number of cards is odd or the data is not valid. Please re-enter the data."
        );
        rows = parseInt(prompt("Enter the number of rows"));
        cols = parseInt(prompt("Enter the number of columns"));
      }

      localStorage.setItem("rows", rows);
      localStorage.setItem("cols", cols);
    }

    return {
      rows: rows,
      cols: cols,
    };
  }


  static resetGame() {
    localStorage.removeItem("cols");
    localStorage.removeItem("rows");
    localStorage.removeItem("boxes");
    localStorage.removeItem("timer");
    localStorage.removeItem("finalTime");
    location.reload();
  }
}

export default Game;
