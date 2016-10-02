const defaults = require('lodash/defaults');
const LifxClient = require('node-lifx').Client;

module.exports = class {
  constructor(options) {
    this.options = defaults(options, {
      fade: 100,
      kelvin: 3500,
      lifx: {}
    });
    this.lifx = new LifxClient();
    this.lifx.on('light-new', light => {
      light.on(0);
      light.color(0, 0, 100);
    });
    this.lifx.init(this.options.lifx);
  }

  hsb(...args) {
    this.lifx.lights().forEach(light => light.color(...args,
      this.options.kelvin,
      this.options.fade
    ));
  }

}
