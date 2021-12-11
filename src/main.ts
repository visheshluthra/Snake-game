import Game from './controllers/Game';

const game = new Game();
const startButton = <HTMLButtonElement>document.getElementsByClassName('popup__button--start')[0];

startButton.addEventListener('click', () => game.start());
