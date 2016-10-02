const denodeify = require('denodeify');
const fs = require('fs');
const Transform = require('stream').Transform;

module.exports = class extends Transform {
  constructor() {
    super({
      objectMode: true,
      transform(frame, _, callback) {
        calibrationFromFrame(frame).then(calibration => {
          callback(null, {
            hands: frame.hands.map(h => tranformHand(h, calibration))
          });
        }).catch(callback);
      }
    });
  }
};

const cachedCalibration = denodeify(fs.readFile)
  ('./leap-calibration', 'utf-8')
  .then(data => JSON.parse(data))
  .catch(() => null);

const calibrationFromBox = (box) => {
  return box.center.map((center, dimensionIndex) => [
    Math.floor(center - box.size[dimensionIndex] / 2),
    Math.ceil(center + box.size[dimensionIndex] / 2)
  ]);
};

const calibrationFromFrame = (frame) => {
  return cachedCalibration.then(calibration => {
    return calibration || calibrationFromBox(frame.interactionBox);
  });
};

const normalizePosition = (position, calibration) => {
  return position.map((value, dimensionIndex) => {
    let dimensionBounds = calibration[dimensionIndex];
    let dimensionExtent = dimensionBounds[1] - dimensionBounds[0];
    value = (value - dimensionBounds[0]) / dimensionExtent;
    return value > 1 ? 1 : value < 0 ? 0 : value;
  });
};

const tranformHand = (hand, calibration) => {
  return {
    position: normalizePosition(hand.palmPosition, calibration)
  };
};
