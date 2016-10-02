const LeapLifx = require('./lib/leap-lifx');
const LeapSource = require('./lib/leap-source');

leapSource = new LeapSource();
leapLifx = new LeapLifx();

leapSource.on('frame', frame => {
  let arr = frame.hands[0];
  if (!arr) return;
  leapLifx.hsb(arr[0] * 360, arr[2] * 100, arr[1] * 100);
});

leapSource.run();
