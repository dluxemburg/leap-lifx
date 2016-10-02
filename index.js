const Monitor = require('forever-monitor').Monitor;
const ps = new Monitor('./lib/leap-lifx-pipe.js');
ps.start();
