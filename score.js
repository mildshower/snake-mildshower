class Score {
  constructor() {
    this.currScore = 0;
  }

  increaseBy(increment) {
    this.currScore += increment;
  }

  get summary() {
    return this.currScore;
  }
}
