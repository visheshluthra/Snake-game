import { CELL_TYPE, START_SNAKE_COORDINATE } from "../shared/constants";
import Grid from "./Grid";
import ICoordinate from "../shared/ICoordinate";

export default class Snake {
    private chain: ICoordinate[] = [];

    get head(): ICoordinate {
        return this.chain[0];
    }

    constructor(private readonly grid: Grid) {}

    eat(coordinate: ICoordinate): void {
        this.chain.unshift(coordinate);
        this.grid.setCell(coordinate, CELL_TYPE.SNAKE);
    }

    move(coordinate: ICoordinate): void {
        this.chain.unshift(coordinate);
        this.grid.setCell(coordinate, CELL_TYPE.SNAKE);

        const nextCoordinate: ICoordinate = {
            row: this.chain[this.chain.length - 1].row,
            column: this.chain[this.chain.length - 1].column
        };

        this.grid.setCell(nextCoordinate, CELL_TYPE.EMPTY);
        this.chain.pop();
    }

    reset(): void {
        this.chain = [START_SNAKE_COORDINATE];
    }
}
