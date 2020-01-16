class Food {
  constructor(position, type, potential, growth) {
    this.position = position.slice();
    this.potential = potential;
    this.growth = growth;
    this.type = type;
  }

  getState() {
    const state = {};
    state.location = this.position.slice();
    state.type = this.type;
    return state;
  }

  get point() {
    return this.potential;
  }

  get growthSize() {
    return this.growth;
  }
}

const createNormalFood = function(position) {
  return new Food(position,'normalFood', 1, 1);
}

const createSpecialFood = function(position) {
  return new Food(position,'specialFood', 10, 0);
}