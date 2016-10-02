const Monitor = require('forever-monitor').Monitor;
const ps = new Monitor(`${__dirname}/lib/leap-lifx-pipe.js`);
ps.start();
