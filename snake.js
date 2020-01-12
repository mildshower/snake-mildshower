const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }

  turnRight() {
    this.heading = (this.heading + 3) % 4;
  }
}

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get head() {
    const head = this.positions[this.positions.length - 1];
    return head.slice();
  }

  getState() {
    const state = {};
    state.location = this.positions.slice();
    state.species = this.type;
    state.previousTail = this.previousTail.slice();
    return state;
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  turnRight() {
    this.direction.turnRight();
  }

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }

  eat() {
    this.positions.unshift(this.previousTail);
  }
}

class Food {
  constructor(position, potential) {
    this.position = position.slice();
    this.potential = potential;
  }

  get location() {
    return this.position.slice();
  }
}

class Game {
  constructor(snake, ghostSnake, initialFood, gridSize) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = initialFood;
    this.gridSize = gridSize;
    this.previousFood = new Food([0, 0], 1);
  }

  getState() {
    const state = {};
    state.snake = this.snake.getState();
    state.ghostSnake = this.ghostSnake.getState();
    state.food = { location: this.food.location };
    state.previousFood = { location: this.previousFood.location };
    return state;
  }

  turnSnake(turnCmd) {
    this.snake['turn' + turnCmd]();
  }

  moveSnakes() {
    this.snake.move();
    this.ghostSnake.move();
  }

  isFoodEaten() {
    const areEqualCells = (cellA, cellB) =>
      cellA.every((elem, indx) => elem === cellB[indx]);

    return areEqualCells(this.snake.head, this.food.location);
  }

  generateNewFood() {
    this.previousFood = this.food;
    const newFoodColId = Math.ceil(Math.random() * this.gridSize[0]);
    const newFoodRowId = Math.ceil(Math.random() * this.gridSize[1]);
    this.food = new Food([newFoodColId, newFoodRowId], 1);
  }

  update() {
    this.moveSnakes();

    if (this.isFoodEaten()) {
      this.generateNewFood();
      this.snake.eat();
    }
  }

  guideGhostSnake() {
    const x = Math.random() * 100;
    if (x > 50) {
      this.ghostSnake.turnLeft();
    }
  }
}

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  const [colId, rowId] = food.location;
  const foodCell = getCell(colId, rowId);
  foodCell.classList.add('food');
};

const renderSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
};

const eraseFood = function(food) {
  const [colId, rowId] = food.location;
  const cellToClear = getCell(colId, rowId);
  cellToClear.classList.remove('food');
};

const drawGame = function(game) {
  const { snake, ghostSnake, food, previousFood } = game.getState();
  renderSnake(snake);
  renderSnake(ghostSnake);
  eraseFood(previousFood);
  drawFood(food);
};

const handleKeyPress = (event, game) => {
  const keyTurnMap = { 37: 'Left', 39: 'Right' };
  const turnCmd = keyTurnMap[event.keyCode];
  turnCmd && game.turnSnake(turnCmd);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => handleKeyPress(event, game);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), 'snake');
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(EAST), 'ghost');
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food([50, 25], 1);
  const game = new Game(snake, ghostSnake, food, [100, 60]);

  createGrids();
  attachEventListeners(game);
  drawGame(game);

  setInterval(() => {
    game.update();
    drawGame(game);
  }, 200);

  setInterval(() => {
    game.guideGhostSnake();
  }, 500);
};
