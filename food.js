const typePropertyLookup = {
  normalFood: { potential: 1, growth: 1 },
  specialFood: { potential: 10, growth: 0 }
};

class Food {
  constructor(position, type) {
    this.position = position.slice();
    this.potential = typePropertyLookup[type].potential;
    this.growth = typePropertyLookup[type].growth;
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