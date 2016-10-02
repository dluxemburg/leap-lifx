const defaults = require('lodash/defaults');
const find = require('lodash/find');
const LifxClient = require('node-lifx').Client;
const Light = require('./light');
const Writable = require('stream').Writable;

module.exports = class extends Writable {
  constructor(options) {
    super({objectMode: true});
    this._lights = [];
    this.options = defaults(options, {
      debug: false
    });
    this.lifx = new LifxClient();
    this.lifx.on('light-new', light => {
      this._lights = this.lifx.lights().map(l => new Light(l));
    });
    this.lifx.init();
  }

  set lightOrder(order) { this.options.lightOrder = order; }

  get lights() {
    if (!this.options.lightOrder) return this._lights;
    return this.options.lightOrder.map(label => {
      return find(this._lights, l => l.label === label);
    }).filter(light => light);
  }

  _write(values, _, callback) {
    if (values.length === 1) values.push(values[0]);
    this.lights.forEach((light, index, lights) => {
      let denominator = lights.length - 1;
      light.color(...values[0].map((v, i) => {
        return v * ((denominator - index) / denominator) +
               values[1][i] * (index / denominator);
      }));
    });
    callback();
  }
};
