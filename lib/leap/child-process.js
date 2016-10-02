const Leap = require('leapjs');
const throttle = require('lodash/throttle');

Leap.loop(throttle(frame => process.send(frame.data), 50));
