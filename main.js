const NUM_OF_COLS = 53;
const NUM_OF_ROWS = 40;

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
  const buttonR = document.getElementById('rightButton');
  buttonR.onclick = ()=>{console.log('hi');game.turnSnake('Right')};
  const buttonL = document.getElementById('leftButton');
  buttonL.onclick = ()=>{game.turnSnake('Left')};
};

const getSnakeState = () => {
  const state = {};
  state.position = [
    [20, 15],
    [21, 15],
    [22, 15]
  ];
  state.orientation = EAST;
  return state;
};

const getGhostSnakeState = () => {
  const state = {};
  state.position = [
    [20, 20],
    [21, 20],
    [22, 20]
  ];
  state.orientation = EAST;
  return state;
};

const initGame = function(game) {
  createGrids();
  attachEventListeners(game);
  drawGame(game);
};

const main = function() {
  const snakeState = getSnakeState();
  const ghostSnakeState = getGhostSnakeState();
  const foodPosition = [27, 20];
  const boundary = [52, 39];
  const game = Game.createGame(snakeState, ghostSnakeState, foodPosition, boundary);
  initGame(game);

  const gameUpdationInterval = setInterval(() => {
    game.update();
    drawGame(game);
    if (game.isOver()) {
      clearInterval(gameUpdationInterval);
      clearInterval(ghostSnakeMovementInterval);
      confirm('Game Over. New Game ?') && location.reload();
    }
  }, 120);

  const ghostSnakeMovementInterval = setInterval(() => {
    game.guideGhostSnake();
  }, 600);
};

window.onload = main;
