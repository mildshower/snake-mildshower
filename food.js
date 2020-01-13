class Food {
  constructor(position, potential, growth) {
    this.position = position.slice();
    this.potential = potential;
    this.growth = growth;
  }

  get location() {
    return this.position.slice();
  }

  get point() {
    return this.potential;
  }

  get growthSize() {
    return this.growth;
  }
}
