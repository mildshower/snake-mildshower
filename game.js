const areEqualCells = (cellA, cellB) =>
  cellA.every((elem, indx) => elem === cellB[indx]);
class Game {
  constructor(snake, ghostSnake, initialFood, gridSize) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = initialFood;
    this.gridSize = gridSize;
    this.previousFood = new Food([0, 0], 1);
    this.score = new Score();
  }

  getState() {
    const state = {};
    state.snake = this.snake.getState();
    state.ghostSnake = this.ghostSnake.getState();
    state.food = { location: this.food.location };
    state.previousFood = { location: this.previousFood.location };
    state.score = this.score.summary;
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
    return areEqualCells(this.snake.head, this.food.location);
  }

  generateNewFood() {
    this.previousFood = this.food;
    const newFoodColId = Math.round(Math.random() * this.gridSize[0]);
    const newFoodRowId = Math.round(Math.random() * this.gridSize[1]);
    this.food = new Food([newFoodColId, newFoodRowId], 1);
  }

  update() {
    this.moveSnakes();

    if (this.isFoodEaten()) {
      this.score.increaseBy(this.food.point);
      this.snake.eat();
      this.generateNewFood();
    }
  }

  guideGhostSnake() {
    const x = Math.random() * 100;
    if (x > 50) {
      this.ghostSnake.turnLeft();
    }
  }

  isOver() {
    const hasSnakeBittenItself = this.snake.hasBittenItself();
    const hasSnakeCrossedBoundary = this.snake.hasCrossedBoundary(
      this.gridSize
    );
    return hasSnakeBittenItself || hasSnakeCrossedBoundary;
  }
}
