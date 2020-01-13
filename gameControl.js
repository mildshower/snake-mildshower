const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';
const SCORE_PAD_ID = 'score';

const getGrid = () => document.getElementById(GRID_ID);
const getScorePad = () => document.getElementById(SCORE_PAD_ID);
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
    cell && cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  const [colId, rowId] = food.location;
  const foodCell = getCell(colId, rowId);
  foodCell.classList.add(food.type);
};

const renderSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
};

const eraseFood = function(food) {
  const [colId, rowId] = food.location;
  const cellToClear = getCell(colId, rowId);
  cellToClear.classList.remove(food.type);
};

const projectScore = function(score) {
  const scorePad = getScorePad();
  scorePad.innerText = score;
};

const renderFood = function(food, previousFood) {
  eraseFood(previousFood);
  drawFood(food);
};

const drawGame = function(game) {
  const { snake, ghostSnake, food, previousFood, score } = game.getState();
  renderFood(food, previousFood);
  renderSnake(snake);
  renderSnake(ghostSnake);
  projectScore(score);
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

const initGame = function(game) {
  createGrids();
  attachEventListeners(game);
  drawGame(game);
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food([47, 30], 'normalFood');
  const game = new Game(snake, ghostSnake, food, [99, 59]);
  initGame(game);

  const gameUpdation = setInterval(() => {
    game.update();
    drawGame(game);
    if (game.isOver()) {
      clearInterval(gameUpdation);
      clearInterval(ghostSnakeMovement);
      confirm('Do you want another game?') && location.reload();
    }
  }, 120);

  const ghostSnakeMovement = setInterval(() => {
    game.guideGhostSnake();
  }, 600);
};
