const LeapReabable = require('./leap/readable');
const LeapCalibration = require('./leap/calibration-transform');
const LifxWritable = require('./lifx/writable');
const ColorTransform = require('./color-transform');

let leapStream = new LeapReabable();
let leapCalibration = new LeapCalibration();
let lifxStream = new LifxWritable();
let colorTransform = new ColorTransform();

leapStream
  .pipe(leapCalibration)
  .pipe(colorTransform)
  .pipe(lifxStream);
