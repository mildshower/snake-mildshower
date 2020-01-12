class Food {
  constructor(position, potential) {
    this.position = position.slice();
    this.potential = potential;
  }

  get location() {
    return this.position.slice();
  }

  get point() {
    return this.potential;
  }
}
