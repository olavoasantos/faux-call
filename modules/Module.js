class Module {
  constructor() {
    this.$$steps = [
      this.init,
    ];
  }

  init(self) {

  }

  extend(step) {
    this.$$steps.push(step);
  }

  set(name, value) {
    this[name] = value;
  }

  $$init() {
    this.$$steps.forEach(step => step(this));
  }
}

module.exports = Module;
