(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../shared/constants");
var Grid_1 = require("./Grid");
var View_1 = require("./View");
var Snake_1 = require("./Snake");
var Game = /** @class */ (function () {
    function Game() {
        this.frame = 0;
        this.score = 0;
        this.isPaused = false;
        this.grid = new Grid_1.default();
        this.view = new View_1.default(this.grid.columnsQuantity, this.grid.rowsQuantity);
        this.snake = new Snake_1.default(this.grid);
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    Game.prototype.start = function () {
        this.view.hideStartScreen();
        this.view.hideFinalScreen();
        this.reset();
        window.focus();
        window.requestAnimationFrame(this.startLoop.bind(this));
    };
    Game.prototype.pause = function () {
        this.isPaused = true;
        this.view.togglePauseScreen();
    };
    Game.prototype.resume = function () {
        this.isPaused = false;
        this.view.togglePauseScreen();
        window.requestAnimationFrame(this.startLoop.bind(this));
    };
    Game.prototype.reset = function () {
        this.speed = constants_1.START_SPEED;
        this.direction = constants_1.START_DIRECTION;
        this.tempDirection = undefined;
        this.grid.reset();
        this.snake.reset();
        this.generateApple();
    };
    Game.prototype.onKeyDown = function (_a) {
        var key = _a.key;
        switch (key) {
            case constants_1.KEY.ARROW_RIGHT:
                if (!this.isPaused) {
                    this.tempDirection = constants_1.DIRECTION.RIGHT;
                }
                break;
            case constants_1.KEY.ARROW_LEFT:
                if (!this.isPaused) {
                    this.tempDirection = constants_1.DIRECTION.LEFT;
                }
                break;
            case constants_1.KEY.ARROW_UP:
                if (!this.isPaused) {
                    this.tempDirection = constants_1.DIRECTION.UP;
                }
                break;
            case constants_1.KEY.ARROW_DOWN:
                if (!this.isPaused) {
                    this.tempDirection = constants_1.DIRECTION.DOWN;
                }
                break;
            case constants_1.KEY.ENTER:
                if (!this.frame) {
                    this.start();
                }
                break;
            case constants_1.KEY.SPACE:
                if (this.frame) {
                    this.isPaused ? this.resume() : this.pause();
                }
                break;
        }
    };
    Game.prototype.generateApple = function () {
        var emptyCoordinates = this.getEmptyCoordinates();
        var foodCoordinate = emptyCoordinates[Math.floor(Math.random() * (emptyCoordinates.length - 1))];
        this.grid.setCell(foodCoordinate, constants_1.CELL_TYPE.APPLE);
    };
    Game.prototype.getEmptyCoordinates = function () {
        var emptyCoordinates = [];
        for (var row = 0; row < this.grid.rowsQuantity; row++) {
            for (var column = 0; column < this.grid.columnsQuantity; column++) {
                if (this.grid.getCell({ row: row, column: column }) === constants_1.CELL_TYPE.EMPTY) {
                    emptyCoordinates.push({ row: row, column: column });
                }
            }
        }
        return emptyCoordinates;
    };
    Game.prototype.startLoop = function () {
        if (this.isPaused) {
            return;
        }
        if (++this.frame % (constants_1.MAX_SPEED - this.speed || constants_1.MIN_SPEED) !== 0) {
            window.requestAnimationFrame(this.startLoop.bind(this));
            return;
        }
        var headRow = this.snake.head.row;
        var headColumn = this.snake.head.column;
        switch (this.getNextDirection()) {
            case constants_1.DIRECTION.RIGHT:
                headColumn++;
                break;
            case constants_1.DIRECTION.LEFT:
                headColumn--;
                break;
            case constants_1.DIRECTION.UP:
                headRow--;
                break;
            case constants_1.DIRECTION.DOWN:
                headRow++;
                break;
        }
        if (this.checkGameOver({ row: headRow, column: headColumn })) {
            this.frame = 0;
            this.view.showFinalScreen(this.score);
            return;
        }
        var isGetApple = this.grid.getCell({ row: headRow, column: headColumn }) === constants_1.CELL_TYPE.APPLE;
        if (isGetApple) {
            this.snake.eat({ row: headRow, column: headColumn });
            this.generateApple();
            this.updateScore(++this.score);
        }
        this.snake.move({ row: headRow, column: headColumn });
        this.view.draw(this.grid.grid);
        window.requestAnimationFrame(this.startLoop.bind(this));
    };
    Game.prototype.getNextDirection = function () {
        switch (this.tempDirection) {
            case constants_1.DIRECTION.RIGHT:
                if (this.direction !== constants_1.DIRECTION.LEFT) {
                    this.direction = constants_1.DIRECTION.RIGHT;
                }
                break;
            case constants_1.DIRECTION.LEFT:
                if (this.direction !== constants_1.DIRECTION.RIGHT) {
                    this.direction = constants_1.DIRECTION.LEFT;
                }
                break;
            case constants_1.DIRECTION.UP:
                if (this.direction !== constants_1.DIRECTION.DOWN) {
                    this.direction = constants_1.DIRECTION.UP;
                }
                break;
            case constants_1.DIRECTION.DOWN:
                if (this.direction !== constants_1.DIRECTION.UP) {
                    this.direction = constants_1.DIRECTION.DOWN;
                }
                break;
        }
        return this.direction;
    };
    Game.prototype.updateScore = function (score) {
        if (score % constants_1.SPEED_INCREASE_INTERVAL === 0) {
            this.view.updateSpeed(++this.speed);
        }
        this.view.updateScore(score);
    };
    Game.prototype.checkGameOver = function (snakeHead) {
        var isTouchedBorder = snakeHead.row < 0 || snakeHead.column < 0 || snakeHead.row > this.grid.rowsQuantity - 1 || snakeHead.column > this.grid.columnsQuantity - 1;
        var isTouchedHerself = this.grid.getCell(snakeHead) === constants_1.CELL_TYPE.SNAKE;
        return isTouchedBorder || isTouchedHerself;
    };
    return Game;
}());
exports.default = Game;
},{"../shared/constants":6,"./Grid":2,"./Snake":3,"./View":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../shared/constants");
var Grid = /** @class */ (function () {
    function Grid() {
        this._grid = [];
        this._cols = Math.round(window.innerWidth / constants_1.CELL_SIZE) - constants_1.GRID_MARGIN;
        this._rows = Math.round(window.innerHeight / constants_1.CELL_SIZE) - constants_1.GRID_MARGIN;
    }
    Object.defineProperty(Grid.prototype, "columnsQuantity", {
        get: function () {
            return this._cols;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "rowsQuantity", {
        get: function () {
            return this._rows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "grid", {
        get: function () {
            return this._grid;
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.getCell = function (coordinate) {
        if (!this.checkCoordinate(coordinate)) {
            return;
        }
        return this._grid[coordinate.row][coordinate.column];
    };
    Grid.prototype.setCell = function (coordinate, type) {
        if (!this.checkCoordinate(coordinate)) {
            return;
        }
        this._grid[coordinate.row][coordinate.column] = type;
    };
    Grid.prototype.reset = function () {
        for (var row = 0; row < this._rows; row++) {
            this._grid[row] = [];
            for (var column = 0; column < this._cols; column++) {
                this._grid[row][column] = constants_1.CELL_TYPE.EMPTY;
            }
        }
    };
    Grid.prototype.checkCoordinate = function (_a) {
        var row = _a.row, column = _a.column;
        return row >= 0 && row <= this.rowsQuantity - 1 && column >= 0 && column <= this.columnsQuantity - 1;
    };
    return Grid;
}());
exports.default = Grid;
},{"../shared/constants":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../shared/constants");
var Snake = /** @class */ (function () {
    function Snake(grid) {
        this.grid = grid;
        this.chain = [];
    }
    Object.defineProperty(Snake.prototype, "head", {
        get: function () {
            return this.chain[0];
        },
        enumerable: true,
        configurable: true
    });
    Snake.prototype.eat = function (coordinate) {
        this.chain.unshift(coordinate);
        this.grid.setCell(coordinate, constants_1.CELL_TYPE.SNAKE);
    };
    Snake.prototype.move = function (coordinate) {
        this.chain.unshift(coordinate);
        this.grid.setCell(coordinate, constants_1.CELL_TYPE.SNAKE);
        var nextCoordinate = {
            row: this.chain[this.chain.length - 1].row,
            column: this.chain[this.chain.length - 1].column
        };
        this.grid.setCell(nextCoordinate, constants_1.CELL_TYPE.EMPTY);
        this.chain.pop();
    };
    Snake.prototype.reset = function () {
        this.chain = [constants_1.START_SNAKE_COORDINATE];
    };
    return Snake;
}());
exports.default = Snake;
},{"../shared/constants":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../shared/constants");
var View = /** @class */ (function () {
    function View(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.startScreen = document.getElementsByClassName('popup--start')[0];
        this.pauseScreen = document.getElementsByClassName('popup--pause')[0];
        this.finalScreen = document.getElementsByClassName('popup--final')[0];
        this.finalScoreContainer = document.getElementsByClassName('popup__final-score')[0];
        this.scoreContainer = document.getElementsByClassName('panel__score')[0];
        this.speedContainer = document.getElementsByClassName('panel__speed')[0];
        this.canvas = document.getElementsByClassName('battlefield')[0];
        this.ctx = this.canvas.getContext('2d');
        this.canvas.setAttribute('width', this.cols * constants_1.CELL_SIZE + "px");
        this.canvas.setAttribute('height', this.rows * constants_1.CELL_SIZE + "px");
    }
    View.prototype.draw = function (grid) {
        var _this = this;
        grid.forEach(function (rowArr, row) {
            rowArr.forEach(function (type, column) {
                _this.drawCell({ row: row, column: column }, type);
            });
        });
    };
    View.prototype.updateScore = function (score) {
        this.scoreContainer.textContent = score.toString();
    };
    View.prototype.updateSpeed = function (speed) {
        this.speedContainer.textContent = speed.toString();
    };
    View.prototype.hideStartScreen = function () {
        this.startScreen.style.display = 'none';
    };
    View.prototype.togglePauseScreen = function () {
        this.pauseScreen.style.display = this.pauseScreen.style.display === 'flex' ? 'none' : 'flex';
    };
    View.prototype.hideFinalScreen = function () {
        this.finalScreen.style.display = 'none';
    };
    View.prototype.showFinalScreen = function (score) {
        this.finalScoreContainer.textContent = score.toString();
        this.finalScreen.style.display = 'flex';
    };
    View.prototype.drawCell = function (_a, type) {
        var row = _a.row, column = _a.column;
        this.ctx.fillStyle = constants_1.COLOR[type] || constants_1.COLOR[constants_1.CELL_TYPE.EMPTY];
        this.ctx.fillRect(column * constants_1.CELL_SIZE, row * constants_1.CELL_SIZE, constants_1.CELL_SIZE, constants_1.CELL_SIZE);
    };
    ;
    return View;
}());
exports.default = View;
},{"../shared/constants":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./controllers/Game");
var game = new Game_1.default();
var startButton = document.getElementsByClassName('popup__button--start')[0];
startButton.addEventListener('click', function () { return game.start(); });
},{"./controllers/Game":1}],6:[function(require,module,exports){
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CELL_SIZE = 20;
exports.GRID_MARGIN = 6;
exports.MIN_SPEED = 1;
exports.MAX_SPEED = 8;
exports.SPEED_INCREASE_INTERVAL = 5;
var KEY;
(function (KEY) {
    KEY["ARROW_UP"] = "ArrowUp";
    KEY["ARROW_RIGHT"] = "ArrowRight";
    KEY["ARROW_DOWN"] = "ArrowDown";
    KEY["ARROW_LEFT"] = "ArrowLeft";
    KEY["ENTER"] = "Enter";
    KEY["SPACE"] = " ";
})(KEY = exports.KEY || (exports.KEY = {}));
var CELL_TYPE;
(function (CELL_TYPE) {
    CELL_TYPE[CELL_TYPE["EMPTY"] = 0] = "EMPTY";
    CELL_TYPE[CELL_TYPE["SNAKE"] = 1] = "SNAKE";
    CELL_TYPE[CELL_TYPE["APPLE"] = 2] = "APPLE";
})(CELL_TYPE = exports.CELL_TYPE || (exports.CELL_TYPE = {}));
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["RIGHT"] = 0] = "RIGHT";
    DIRECTION[DIRECTION["LEFT"] = 1] = "LEFT";
    DIRECTION[DIRECTION["DOWN"] = 2] = "DOWN";
    DIRECTION[DIRECTION["UP"] = 3] = "UP";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
exports.COLOR = (_a = {},
    _a[CELL_TYPE.SNAKE] = '#0057e7',
    _a[CELL_TYPE.APPLE] = '#d62d20',
    _a[CELL_TYPE.EMPTY] = '#ffffff',
    _a);
exports.START_SPEED = exports.MIN_SPEED;
exports.START_DIRECTION = DIRECTION.RIGHT;
exports.START_SNAKE_COORDINATE = {
    row: 3,
    column: 3
};
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29udHJvbGxlcnMvR2FtZS50cyIsInNyYy9jb250cm9sbGVycy9HcmlkLnRzIiwic3JjL2NvbnRyb2xsZXJzL1NuYWtlLnRzIiwic3JjL2NvbnRyb2xsZXJzL1ZpZXcudHMiLCJzcmMvbWFpbi50cyIsInNyYy9zaGFyZWQvY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxpREFBNkk7QUFDN0ksK0JBQTBCO0FBQzFCLCtCQUEwQjtBQUMxQixpQ0FBNEI7QUFHNUI7SUFXSTtRQVBRLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUlsQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBRzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxvQkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRTVCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUViLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFD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Q0FBQTtJQUNmLGtCQUFXLENBQUE7QUFDZixDQUFDLEVBUFcsR0FBRyxHQUFILFdBQUcsS0FBSCxXQUFHLFFBT2Q7QUFFRCxJQUFZLFNBSVg7QUFKRCxXQUFZLFNBQVM7SUFDakIsMkNBQUssQ0FBQTtJQUNMLDJDQUFLLENBQUE7SUFDTCwyQ0FBSyxDQUFBO0FBQ1QsQ0FBQyxFQUpXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBSXBCO0FBRUQsSUFBWSxTQUtYO0FBTEQsV0FBWSxTQUFTO0lBQ2pCLDJDQUFLLENBQUE7SUFDTCx5Q0FBSSxDQUFBO0lBQ0oseUNBQUksQ0FBQTtJQUNKLHFDQUFFLENBQUE7QUFDTixDQUFDLEVBTFcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFLcEI7QUFFWSxRQUFBLEtBQUs7SUFDZCxHQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUcsU0FBUztJQUM1QixHQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUcsU0FBUztJQUM1QixHQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUcsU0FBUztRQUM5QjtBQUVXLFFBQUEsV0FBVyxHQUFXLGlCQUFTLENBQUM7QUFDaEMsUUFBQSxlQUFlLEdBQWMsU0FBUyxDQUFDLEtBQUssQ0FBQztBQUM3QyxRQUFBLHNCQUFzQixHQUFnQjtJQUMvQyxHQUFHLEVBQUUsQ0FBQztJQUNOLE1BQU0sRUFBRSxDQUFDO0NBQ1osQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IENFTExfVFlQRSwgRElSRUNUSU9OLCBLRVksIE1BWF9TUEVFRCwgTUlOX1NQRUVELCBTUEVFRF9JTkNSRUFTRV9JTlRFUlZBTCwgU1RBUlRfRElSRUNUSU9OLCBTVEFSVF9TUEVFRCB9IGZyb20gXCIuLi9zaGFyZWQvY29uc3RhbnRzXCI7XHJcbmltcG9ydCBHcmlkIGZyb20gXCIuL0dyaWRcIjtcclxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vVmlld1wiO1xyXG5pbXBvcnQgU25ha2UgZnJvbSBcIi4vU25ha2VcIjtcclxuaW1wb3J0IElDb29yZGluYXRlIGZyb20gXCIuLi9zaGFyZWQvSUNvb3JkaW5hdGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB2aWV3OiBWaWV3O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBncmlkOiBHcmlkO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzbmFrZTogU25ha2U7XHJcbiAgICBwcml2YXRlIGZyYW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzY29yZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3BlZWQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgZGlyZWN0aW9uOiBESVJFQ1RJT047XHJcbiAgICBwcml2YXRlIHRlbXBEaXJlY3Rpb246IERJUkVDVElPTjtcclxuICAgIHByaXZhdGUgaXNQYXVzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmdyaWQgPSBuZXcgR3JpZCgpO1xyXG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBWaWV3KHRoaXMuZ3JpZC5jb2x1bW5zUXVhbnRpdHksIHRoaXMuZ3JpZC5yb3dzUXVhbnRpdHkpO1xyXG4gICAgICAgIHRoaXMuc25ha2UgPSBuZXcgU25ha2UodGhpcy5ncmlkKTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnZpZXcuaGlkZVN0YXJ0U2NyZWVuKCk7XHJcbiAgICAgICAgdGhpcy52aWV3LmhpZGVGaW5hbFNjcmVlbigpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5mb2N1cygpO1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5zdGFydExvb3AuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy52aWV3LnRvZ2dsZVBhdXNlU2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdW1lKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnZpZXcudG9nZ2xlUGF1c2VTY3JlZW4oKTtcclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RhcnRMb29wLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IFNUQVJUX1NQRUVEO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gU1RBUlRfRElSRUNUSU9OO1xyXG4gICAgICAgIHRoaXMudGVtcERpcmVjdGlvbiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgdGhpcy5ncmlkLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5zbmFrZS5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVBcHBsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25LZXlEb3duKHsga2V5IH06IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICBjYXNlIEtFWS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1BhdXNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVtcERpcmVjdGlvbiA9IERJUkVDVElPTi5SSUdIVDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEtFWS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzUGF1c2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZW1wRGlyZWN0aW9uID0gRElSRUNUSU9OLkxFRlQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBLRVkuQVJST1dfVVA6XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNQYXVzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbXBEaXJlY3Rpb24gPSBESVJFQ1RJT04uVVA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBLRVkuQVJST1dfRE9XTjpcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1BhdXNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVtcERpcmVjdGlvbiA9IERJUkVDVElPTi5ET1dOO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgS0VZLkVOVEVSOlxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgS0VZLlNQQUNFOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZnJhbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUGF1c2VkID8gdGhpcy5yZXN1bWUoKSA6IHRoaXMucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlQXBwbGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZW1wdHlDb29yZGluYXRlczogSUNvb3JkaW5hdGVbXSA9IHRoaXMuZ2V0RW1wdHlDb29yZGluYXRlcygpO1xyXG4gICAgICAgIGNvbnN0IGZvb2RDb29yZGluYXRlOiBJQ29vcmRpbmF0ZSA9IGVtcHR5Q29vcmRpbmF0ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGVtcHR5Q29vcmRpbmF0ZXMubGVuZ3RoIC0gMSkpXTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmlkLnNldENlbGwoZm9vZENvb3JkaW5hdGUsIENFTExfVFlQRS5BUFBMRSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFbXB0eUNvb3JkaW5hdGVzKCk6IElDb29yZGluYXRlW10ge1xyXG4gICAgICAgIGNvbnN0IGVtcHR5Q29vcmRpbmF0ZXM6IElDb29yZGluYXRlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgcm93OiBudW1iZXIgPSAwOyByb3cgPCB0aGlzLmdyaWQucm93c1F1YW50aXR5OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2x1bW46IG51bWJlciA9IDA7IGNvbHVtbiA8IHRoaXMuZ3JpZC5jb2x1bW5zUXVhbnRpdHk7IGNvbHVtbisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncmlkLmdldENlbGwoeyByb3csIGNvbHVtbiB9KSA9PT0gQ0VMTF9UWVBFLkVNUFRZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlDb29yZGluYXRlcy5wdXNoKHsgcm93LCBjb2x1bW4gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBlbXB0eUNvb3JkaW5hdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnRMb29wKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGF1c2VkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgrK3RoaXMuZnJhbWUgJSAoTUFYX1NQRUVEIC0gdGhpcy5zcGVlZCB8fCBNSU5fU1BFRUQpICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5zdGFydExvb3AuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBoZWFkUm93OiBudW1iZXIgPSB0aGlzLnNuYWtlLmhlYWQucm93O1xyXG4gICAgICAgIGxldCBoZWFkQ29sdW1uOiBudW1iZXIgPSB0aGlzLnNuYWtlLmhlYWQuY29sdW1uO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZ2V0TmV4dERpcmVjdGlvbigpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgaGVhZENvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICBoZWFkQ29sdW1uLS07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgICAgICAgICBoZWFkUm93LS07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICAgICAgICAgIGhlYWRSb3crKztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHYW1lT3Zlcih7IHJvdzogaGVhZFJvdywgY29sdW1uOiBoZWFkQ29sdW1uIH0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXcuc2hvd0ZpbmFsU2NyZWVuKHRoaXMuc2NvcmUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaXNHZXRBcHBsZTogYm9vbGVhbiA9IHRoaXMuZ3JpZC5nZXRDZWxsKHsgcm93OiBoZWFkUm93LCBjb2x1bW46IGhlYWRDb2x1bW4gfSkgPT09IENFTExfVFlQRS5BUFBMRTtcclxuXHJcbiAgICAgICAgaWYgKGlzR2V0QXBwbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zbmFrZS5lYXQoeyByb3c6IGhlYWRSb3csIGNvbHVtbjogaGVhZENvbHVtbiB9KTtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUFwcGxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKyt0aGlzLnNjb3JlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc25ha2UubW92ZSh7IHJvdzogaGVhZFJvdywgY29sdW1uOiBoZWFkQ29sdW1uIH0pO1xyXG4gICAgICAgIHRoaXMudmlldy5kcmF3KHRoaXMuZ3JpZC5ncmlkKTtcclxuXHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0YXJ0TG9vcC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldE5leHREaXJlY3Rpb24oKTogRElSRUNUSU9OIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudGVtcERpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiAhPT0gRElSRUNUSU9OLkxFRlQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERJUkVDVElPTi5SSUdIVDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uICE9PSBESVJFQ1RJT04uUklHSFQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IERJUkVDVElPTi5MRUZUO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLlVQOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uICE9PSBESVJFQ1RJT04uRE9XTikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRElSRUNUSU9OLlVQO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gIT09IERJUkVDVElPTi5VUCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRElSRUNUSU9OLkRPV047XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNjb3JlKHNjb3JlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAoc2NvcmUgJSBTUEVFRF9JTkNSRUFTRV9JTlRFUlZBTCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlU3BlZWQoKyt0aGlzLnNwZWVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmlldy51cGRhdGVTY29yZShzY29yZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0dhbWVPdmVyKHNuYWtlSGVhZDogSUNvb3JkaW5hdGUpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpc1RvdWNoZWRCb3JkZXI6IGJvb2xlYW4gPSBzbmFrZUhlYWQucm93IDwgMCB8fCBzbmFrZUhlYWQuY29sdW1uIDwgMCB8fCBzbmFrZUhlYWQucm93ID4gdGhpcy5ncmlkLnJvd3NRdWFudGl0eSAtIDEgfHwgc25ha2VIZWFkLmNvbHVtbiA+IHRoaXMuZ3JpZC5jb2x1bW5zUXVhbnRpdHkgLSAxO1xyXG4gICAgICAgIGNvbnN0IGlzVG91Y2hlZEhlcnNlbGY6IGJvb2xlYW4gPSB0aGlzLmdyaWQuZ2V0Q2VsbChzbmFrZUhlYWQpID09PSBDRUxMX1RZUEUuU05BS0U7XHJcblxyXG4gICAgICAgIHJldHVybiBpc1RvdWNoZWRCb3JkZXIgfHwgaXNUb3VjaGVkSGVyc2VsZjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDRUxMX1NJWkUsIENFTExfVFlQRSwgR1JJRF9NQVJHSU4gfSBmcm9tIFwiLi4vc2hhcmVkL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgSUNvb3JkaW5hdGUgZnJvbSBcIi4uL3NoYXJlZC9JQ29vcmRpbmF0ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9ncmlkOiBDRUxMX1RZUEVbXVtdID0gW107XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jb2xzOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yb3dzOiBudW1iZXI7XHJcblxyXG4gICAgZ2V0IGNvbHVtbnNRdWFudGl0eSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByb3dzUXVhbnRpdHkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm93cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZ3JpZCgpOiBDRUxMX1RZUEVbXVtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3JpZDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9jb2xzID0gTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJXaWR0aCAvIENFTExfU0laRSkgLSBHUklEX01BUkdJTjtcclxuICAgICAgICB0aGlzLl9yb3dzID0gTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJIZWlnaHQgLyBDRUxMX1NJWkUpIC0gR1JJRF9NQVJHSU47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2VsbChjb29yZGluYXRlOiBJQ29vcmRpbmF0ZSk6IENFTExfVFlQRSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrQ29vcmRpbmF0ZShjb29yZGluYXRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3JpZFtjb29yZGluYXRlLnJvd11bY29vcmRpbmF0ZS5jb2x1bW5dO1xyXG4gICAgfVxyXG5cclxuICAgIHNldENlbGwoY29vcmRpbmF0ZTogSUNvb3JkaW5hdGUsIHR5cGU6IENFTExfVFlQRSk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5jaGVja0Nvb3JkaW5hdGUoY29vcmRpbmF0ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZ3JpZFtjb29yZGluYXRlLnJvd11bY29vcmRpbmF0ZS5jb2x1bW5dID0gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGxldCByb3c6IG51bWJlciA9IDA7IHJvdyA8IHRoaXMuX3Jvd3M7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dyaWRbcm93XSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uOiBudW1iZXIgPSAwOyBjb2x1bW4gPCB0aGlzLl9jb2xzOyBjb2x1bW4rKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ3JpZFtyb3ddW2NvbHVtbl0gPSBDRUxMX1RZUEUuRU1QVFk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0Nvb3JkaW5hdGUoeyByb3csIGNvbHVtbiB9OiBJQ29vcmRpbmF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByb3cgPj0gMCAmJiByb3cgPD0gdGhpcy5yb3dzUXVhbnRpdHkgLSAxICYmIGNvbHVtbiA+PSAwICYmIGNvbHVtbiA8PSB0aGlzLmNvbHVtbnNRdWFudGl0eSAtIDE7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ0VMTF9UWVBFLCBTVEFSVF9TTkFLRV9DT09SRElOQVRFIH0gZnJvbSBcIi4uL3NoYXJlZC9jb25zdGFudHNcIjtcclxuaW1wb3J0IEdyaWQgZnJvbSBcIi4vR3JpZFwiO1xyXG5pbXBvcnQgSUNvb3JkaW5hdGUgZnJvbSBcIi4uL3NoYXJlZC9JQ29vcmRpbmF0ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU25ha2Uge1xyXG4gICAgcHJpdmF0ZSBjaGFpbjogSUNvb3JkaW5hdGVbXSA9IFtdO1xyXG5cclxuICAgIGdldCBoZWFkKCk6IElDb29yZGluYXRlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpblswXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGdyaWQ6IEdyaWQpIHt9XHJcblxyXG4gICAgZWF0KGNvb3JkaW5hdGU6IElDb29yZGluYXRlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGFpbi51bnNoaWZ0KGNvb3JkaW5hdGUpO1xyXG4gICAgICAgIHRoaXMuZ3JpZC5zZXRDZWxsKGNvb3JkaW5hdGUsIENFTExfVFlQRS5TTkFLRSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZShjb29yZGluYXRlOiBJQ29vcmRpbmF0ZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2hhaW4udW5zaGlmdChjb29yZGluYXRlKTtcclxuICAgICAgICB0aGlzLmdyaWQuc2V0Q2VsbChjb29yZGluYXRlLCBDRUxMX1RZUEUuU05BS0UpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXh0Q29vcmRpbmF0ZTogSUNvb3JkaW5hdGUgPSB7XHJcbiAgICAgICAgICAgIHJvdzogdGhpcy5jaGFpblt0aGlzLmNoYWluLmxlbmd0aCAtIDFdLnJvdyxcclxuICAgICAgICAgICAgY29sdW1uOiB0aGlzLmNoYWluW3RoaXMuY2hhaW4ubGVuZ3RoIC0gMV0uY29sdW1uXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmlkLnNldENlbGwobmV4dENvb3JkaW5hdGUsIENFTExfVFlQRS5FTVBUWSk7XHJcbiAgICAgICAgdGhpcy5jaGFpbi5wb3AoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNoYWluID0gW1NUQVJUX1NOQUtFX0NPT1JESU5BVEVdO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENFTExfU0laRSwgQ0VMTF9UWVBFLCBDT0xPUiB9IGZyb20gXCIuLi9zaGFyZWQvY29uc3RhbnRzXCI7XHJcbmltcG9ydCBJQ29vcmRpbmF0ZSBmcm9tIFwiLi4vc2hhcmVkL0lDb29yZGluYXRlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0YXJ0U2NyZWVuOiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGF1c2VTY3JlZW46IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmaW5hbFNjcmVlbjogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZpbmFsU2NvcmVDb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzY29yZUNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNwZWVkQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbHM6IG51bWJlciwgcHJpdmF0ZSByZWFkb25seSByb3dzOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BvcHVwLS1zdGFydCcpWzBdO1xyXG4gICAgICAgIHRoaXMucGF1c2VTY3JlZW4gPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncG9wdXAtLXBhdXNlJylbMF07XHJcbiAgICAgICAgdGhpcy5maW5hbFNjcmVlbiA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwb3B1cC0tZmluYWwnKVswXTtcclxuICAgICAgICB0aGlzLmZpbmFsU2NvcmVDb250YWluZXIgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncG9wdXBfX2ZpbmFsLXNjb3JlJylbMF07XHJcbiAgICAgICAgdGhpcy5zY29yZUNvbnRhaW5lciA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYW5lbF9fc2NvcmUnKVswXTtcclxuICAgICAgICB0aGlzLnNwZWVkQ29udGFpbmVyID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhbmVsX19zcGVlZCcpWzBdO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JhdHRsZWZpZWxkJylbMF07XHJcbiAgICAgICAgdGhpcy5jdHggPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPnRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBgJHt0aGlzLmNvbHMgKiBDRUxMX1NJWkV9cHhgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGAke3RoaXMucm93cyAqIENFTExfU0laRX1weGApO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoZ3JpZDogQ0VMTF9UWVBFW11bXSk6IHZvaWQge1xyXG4gICAgICAgIGdyaWQuZm9yRWFjaCgocm93QXJyOiBbXSwgcm93OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcm93QXJyLmZvckVhY2goKHR5cGU6IENFTExfVFlQRSwgY29sdW1uOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0NlbGwoeyByb3csIGNvbHVtbiB9LCB0eXBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2NvcmUoc2NvcmU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2NvcmVDb250YWluZXIudGV4dENvbnRlbnQgPSBzY29yZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNwZWVkKHNwZWVkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNwZWVkQ29udGFpbmVyLnRleHRDb250ZW50ID0gc3BlZWQudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlU3RhcnRTY3JlZW4oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGFydFNjcmVlbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVBhdXNlU2NyZWVuKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucGF1c2VTY3JlZW4uc3R5bGUuZGlzcGxheSA9IHRoaXMucGF1c2VTY3JlZW4uc3R5bGUuZGlzcGxheSA9PT0gJ2ZsZXgnID8gJ25vbmUnIDogJ2ZsZXgnO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVGaW5hbFNjcmVlbigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZpbmFsU2NyZWVuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0ZpbmFsU2NyZWVuKHNjb3JlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZpbmFsU2NvcmVDb250YWluZXIudGV4dENvbnRlbnQgPSBzY29yZS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuZmluYWxTY3JlZW4uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdDZWxsKHsgcm93LCBjb2x1bW4gfTogSUNvb3JkaW5hdGUsIHR5cGU6IENFTExfVFlQRSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IENPTE9SW3R5cGVdIHx8IENPTE9SW0NFTExfVFlQRS5FTVBUWV07XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoY29sdW1uICogQ0VMTF9TSVpFLCByb3cgKiBDRUxMX1NJWkUsIENFTExfU0laRSwgQ0VMTF9TSVpFKTtcclxuICAgIH07XHJcbn1cclxuIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9jb250cm9sbGVycy9HYW1lJztcclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xyXG5jb25zdCBzdGFydEJ1dHRvbiA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwb3B1cF9fYnV0dG9uLS1zdGFydCcpWzBdO1xyXG5cclxuc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBnYW1lLnN0YXJ0KCkpO1xyXG4iLCJpbXBvcnQgSUNvb3JkaW5hdGUgZnJvbSBcIi4vSUNvb3JkaW5hdGVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBDRUxMX1NJWkU6IG51bWJlciA9IDIwO1xyXG5leHBvcnQgY29uc3QgR1JJRF9NQVJHSU46IG51bWJlciA9IDY7XHJcbmV4cG9ydCBjb25zdCBNSU5fU1BFRUQ6IG51bWJlciA9IDE7XHJcbmV4cG9ydCBjb25zdCBNQVhfU1BFRUQ6IG51bWJlciA9IDg7XHJcbmV4cG9ydCBjb25zdCBTUEVFRF9JTkNSRUFTRV9JTlRFUlZBTDogbnVtYmVyID0gNTtcclxuXHJcbmV4cG9ydCBlbnVtIEtFWSB7XHJcbiAgICBBUlJPV19VUCA9ICdBcnJvd1VwJyxcclxuICAgIEFSUk9XX1JJR0hUID0gJ0Fycm93UmlnaHQnLFxyXG4gICAgQVJST1dfRE9XTiA9ICdBcnJvd0Rvd24nLFxyXG4gICAgQVJST1dfTEVGVCA9ICdBcnJvd0xlZnQnLFxyXG4gICAgRU5URVIgPSAnRW50ZXInLFxyXG4gICAgU1BBQ0UgPSAnICdcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQ0VMTF9UWVBFIHtcclxuICAgIEVNUFRZLFxyXG4gICAgU05BS0UsXHJcbiAgICBBUFBMRVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBESVJFQ1RJT04ge1xyXG4gICAgUklHSFQsXHJcbiAgICBMRUZULFxyXG4gICAgRE9XTixcclxuICAgIFVQXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBDT0xPUiA9IHtcclxuICAgIFtDRUxMX1RZUEUuU05BS0VdOiAnIzAwNTdlNycsXHJcbiAgICBbQ0VMTF9UWVBFLkFQUExFXTogJyNkNjJkMjAnLFxyXG4gICAgW0NFTExfVFlQRS5FTVBUWV06ICcjZmZmZmZmJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNUQVJUX1NQRUVEOiBudW1iZXIgPSBNSU5fU1BFRUQ7XHJcbmV4cG9ydCBjb25zdCBTVEFSVF9ESVJFQ1RJT046IERJUkVDVElPTiA9IERJUkVDVElPTi5SSUdIVDtcclxuZXhwb3J0IGNvbnN0IFNUQVJUX1NOQUtFX0NPT1JESU5BVEU6IElDb29yZGluYXRlID0ge1xyXG4gICAgcm93OiAzLFxyXG4gICAgY29sdW1uOiAzXHJcbn07XHJcbiJdfQ==
