import '../sass/main.scss'

import Game from './class/game.js';

document.getElementById('reset').addEventListener('click', () => {
    Game.resetGame();
});

let data = Game.getRowsCols();

let game = new Game(data.rows, data.cols, 'game');

