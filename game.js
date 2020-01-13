class Game {
  constructor(snake, ghostSnake, initialFood, gridSize) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = initialFood;
    this.gridSize = gridSize;
    this.previousFood = new Food([0, 0], 'normalFood');
    this.score = new Score();
  }

  getState() {
    const state = {};
    state.snake = this.snake.getState();
    state.ghostSnake = this.ghostSnake.getState();
    state.food = this.food.getState();
    state.previousFood = this.previousFood.getState();
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

  generateNewFood() {
    this.previousFood = this.food;
    const newFoodColId = Math.round(Math.random() * this.gridSize[0]);
    const newFoodRowId = Math.round(Math.random() * this.gridSize[1]);
    let newFoodType = Math.random() > 0.9 ? 'specialFood' : 'normalFood';
    this.food = new Food([newFoodColId, newFoodRowId], newFoodType);
  }

  update() {
    this.moveSnakes();

    if (this.ghostSnake.eat(this.food)) {
      this.generateNewFood();
    }

    if (this.snake.eat(this.food)) {
      this.score.increaseBy(this.food.point);
      this.generateNewFood();
    }
  }

  guideGhostSnake() {
    const x = Math.random() * 100;
    if (x > 10) {
      this.ghostSnake.turnLeft();
    }
  }

  isOver() {
    const hasSnakeBittenItself = this.snake.hasBittenItself();
    const hasSnakeCrossedBoundary = this.snake.hasCrossedBoundary(
      this.gridSize
    );
    const ghostSnakeLocation = this.ghostSnake.getState().location;
    const hasTouchedGhost = ghostSnakeLocation.some(coords =>
      this.snake.isHeadOn(coords)
    );
    return hasSnakeBittenItself || hasSnakeCrossedBoundary || hasTouchedGhost;
  }
}
