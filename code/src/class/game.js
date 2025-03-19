import shuffleArray from '../utils/utils.js';
import Box from './box.js';

class Game {
    #rows;
    #cols;
    #idElement;
    #boxes;
    element;

    constructor(rows, cols, idElement='game') {
        this.#rows = rows;
        this.#cols = cols;
        this.#idElement = idElement;
        this.element = document.getElementById(this.#idElement);
        this.#boxes = [];
        this.createBoxes();
        this.paintBoxes();

        this.element.addEventListener('click', () => {
            this.checkOpenBoxes();
        });
    }

    checkOpenBoxes() {
        // Comporbamos si ya hay más de 1 caja abierta
        let openBoxes = this.#boxes.filter(box => (box.open && box.free));
        if (openBoxes.length === 2) {
            if (openBoxes[0].color === openBoxes[1].color) {
                openBoxes.map(box => {
                    box.free = false;
                });
            } else {
                setTimeout(() => {
                    openBoxes.map(box => {
                        box.resetColor();
                    });
                }, 500);
            }
        }
    }

    createRandomColors() {
        let randomColors = [];
        for (let index = 0; index < (this.#cols*this.#rows) / 2; index++) {
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
        let randomColors = this.createRandomColors();

        for (let row = 0; row <this.#rows; row++) {
            for (let col = 0; col < this.#cols; col++) {
                let color = randomColors.shift();
                let newBox = new Box(row, col, color);
                this.#boxes.push(newBox);
            }
        }
    }

    paintBoxes() {
        this.setCSSTemplateBoxes();
        this.#boxes.map(box => {
            let newBoxDiv = document.createElement('div');
            newBoxDiv.classList.add('box');
            newBoxDiv.dataset.col = box.col;
            newBoxDiv.dataset.row = box.row;
            box.element = newBoxDiv;
            box.addEventClick();
            this.element.appendChild(newBoxDiv);
        });
        
    }

    setCSSTemplateBoxes() {
        this.element.style.gridTemplateColumns = `repeat(${this.#cols}, 1fr)`;
        this.element.style.gridTemplateRows = `repeat(${this.#rows}, 1fr)`;
    }
    
    static getRowsCols() {

        let rows, cols;

        if (localStorage.getItem('rows') !== null && localStorage.getItem('cols') !== null) {
            rows = parseInt(localStorage.getItem('rows'));
            cols = parseInt(localStorage.getItem('cols'));
        } else {
            rows = parseInt(prompt('Introduce el numero de filas'));
            cols = parseInt(prompt('Introduce el numero de columnas'));

            while (rows*cols % 2 !== 0) {
                alert('El número de casillas debe ser par, vuelve a introducir los datos');
                rows = parseInt(prompt('Introduce el numero de filas'));
                cols = parseInt(prompt('Introduce el numero de columnas'));
            }

            localStorage.setItem('rows', rows);
            localStorage.setItem('cols', cols);
        }

        return {
            'rows': rows,
            'cols': cols,
        }
    }

    static resetGame() {
        localStorage.removeItem('rows');
        localStorage.removeItem('cols');
        location.reload();
    }
}

export default Game;