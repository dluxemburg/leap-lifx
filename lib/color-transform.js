const denodeify = require('denodeify');
const fs = require('fs');
const Transform = require('stream').Transform;

module.exports = class extends Transform {
  constructor() {
    super({
      objectMode: true,
      transform(frame, _, callback) {
        if (!frame.hands.length) return callback();
        callback(null, frame.hands.map(hand => hand.position)
          .map(p => [p[0] * 360, p[2] * 100, p[1] * 100]));
      }
    });
  }
};
