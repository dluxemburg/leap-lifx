const defaults = require('lodash/defaults');
const EventEmitter = require('events');
const fs = require('fs');
const Leap = require('leapjs');
const throttle = require('lodash/throttle');

module.exports = class extends EventEmitter {
  run(options) {
    if (this._running) {
      throw new Error('LeapSource instance is already running!');
    }
    this._running = true;

    options = defaults(options, {throttle: 100});

    fs.readFile('.leap-calibration', 'utf-8', (err, data) => {
      if (!err) this.calibration = JSON.parse(data);

      Leap.loop(throttle(frame => this.handleFrame(frame), options.throttle));
    });
  }

  handleFrame(frame) {
    if (!this.calibration) {
      this.calibration = calibrationFromBox(frame.interactionBox);
    }

    this.emit('frame', {
      hands: frame.hands.map(h => this.mapHand(h))
    });
  }

  mapHand(hand) {
    return hand.palmPosition.map((p, i) => this.calibrate(p, i));
  }

  calibrate(position, index) {
    let dimension = this.calibration[index];
    let value = (position - dimension[0]) / (dimension[1] - dimension[0]);
    return value > 1 ? 1 : value < 0 ? 0 : value;
  }
};

const calibrationFromBox = (box) => {
  return box.center.map((middle, index) => {
    let range = box.size[index] / 2;
    return [Math.floor(middle - range), Math.ceil(middle + range)];
  });
};
