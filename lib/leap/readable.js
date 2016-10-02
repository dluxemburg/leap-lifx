const fork = require('child_process').fork;
const Readable = require('stream').Readable;

module.exports = class extends Readable {
  constructor() {
    super({objectMode: true, read() { this.on = true; }});
    this.fork();
  }

  fork() {
    this.leap = fork(`${__dirname}/child-process.js`, {silent: true});
    this.leap.on('message', frame => this.on = this.on ? this.push(frame) : false);
    this.leap.on('exit', () => this.fork());
  }
};
