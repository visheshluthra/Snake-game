import { CELL_SIZE, CELL_TYPE, GRID_MARGIN } from "../shared/constants";
import ICoordinate from "../shared/ICoordinate";

export default class Grid {
    private readonly _grid: CELL_TYPE[][] = [];
    private readonly _cols: number;
    private readonly _rows: number;

    get columnsQuantity(): number {
        return this._cols;
    }

    get rowsQuantity(): number {
        return this._rows;
    }

    get grid(): CELL_TYPE[][] {
        return this._grid;
    }

    constructor() {
        this._cols = Math.round(window.innerWidth / CELL_SIZE) - GRID_MARGIN;
        this._rows = Math.round(window.innerHeight / CELL_SIZE) - GRID_MARGIN;
    }

    getCell(coordinate: ICoordinate): CELL_TYPE {
        if (!this.checkCoordinate(coordinate)) {
            return;
        }

        return this._grid[coordinate.row][coordinate.column];
    }

    setCell(coordinate: ICoordinate, type: CELL_TYPE): void {
        if (!this.checkCoordinate(coordinate)) {
            return;
        }

        this._grid[coordinate.row][coordinate.column] = type;
    }

    reset(): void {
        for (let row: number = 0; row < this._rows; row++) {
            this._grid[row] = [];

            for (let column: number = 0; column < this._cols; column++) {
                this._grid[row][column] = CELL_TYPE.EMPTY;
            }
        }
    }

    private checkCoordinate({ row, column }: ICoordinate): boolean {
        return row >= 0 && row <= this.rowsQuantity - 1 && column >= 0 && column <= this.columnsQuantity - 1;
    }
}
