import ICoordinate from "./ICoordinate";

export const CELL_SIZE: number = 20;
export const GRID_MARGIN: number = 6;
export const MIN_SPEED: number = 1;
export const MAX_SPEED: number = 8;
export const SPEED_INCREASE_INTERVAL: number = 5;

export enum KEY {
    ARROW_UP = 'ArrowUp',
    ARROW_RIGHT = 'ArrowRight',
    ARROW_DOWN = 'ArrowDown',
    ARROW_LEFT = 'ArrowLeft',
    ENTER = 'Enter',
    SPACE = ' '
}

export enum CELL_TYPE {
    EMPTY,
    SNAKE,
    APPLE
}

export enum DIRECTION {
    RIGHT,
    LEFT,
    DOWN,
    UP
}

export const COLOR = {
    [CELL_TYPE.SNAKE]: '#0057e7',
    [CELL_TYPE.APPLE]: '#d62d20',
    [CELL_TYPE.EMPTY]: '#ffffff'
};

export const START_SPEED: number = MIN_SPEED;
export const START_DIRECTION: DIRECTION = DIRECTION.RIGHT;
export const START_SNAKE_COORDINATE: ICoordinate = {
    row: 3,
    column: 3
};
