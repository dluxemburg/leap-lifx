module.exports = class {
  constructor(light) { this.light = light; }

  get label() { return this.light.label; }

  color(...args) {
    if (this.updating) {
      this.next = averageHsb(this.next || args, args);
    } else {
      this._color(...args);
    }
  }

  _color(h, s, b, k = 3500, fade = 50) {
    this.updating = true;
    this.light.color(...boundHsb(h, s, b), k, fade, () => {
      if (this.next) {
        this._color(...this.next);
        delete this.next;
      } else {
        delete this.updating;
      }
    });
  }
}

const averageHsb = (hsb1, hsb2) => {
  return hsb1.map((v, i) => (v + hsb2[i]) / 2);
};

const boundHsb = (h, s, b) => {
  return [bound(h, 0, 360), bound(s, 0, 100), bound(b, 0, 100)];
};

const bound = (value, min, max) => {
  return value > max ? max : value < min ? min : value;
}
