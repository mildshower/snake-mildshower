const areEqualCells = (cellA, cellB) =>
  cellA.every((elem, indx) => elem === cellB[indx]);

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

  grow(size) {
    for (let times = 1; times <= size; times++) {
      this.positions.unshift(this.previousTail);
    }
  }

  eat(food) {
    const isEdible = areEqualCells(this.head, food.getState().location);
    if (isEdible) {
      this.grow(food.growthSize);
    }
    return isEdible;
  }

  hasBittenItself() {
    const restsBody = this.positions.slice(0, this.positions.length - 1);
    return restsBody.some(cell => areEqualCells(cell, this.head));
  }

  hasCrossedBoundary(boundary) {
    const crossedHorizontally = this.head[0] < 0 || this.head[0] > boundary[0];
    const crossedVertically = this.head[1] < 0 || this.head[1] > boundary[1];
    return crossedHorizontally || crossedVertically;
  }
}
