var events = require('events'),
    util = require('util'),
    child_process = require('child_process')

var Lifx = exports.Lifx = function(){
  events.EventEmitter.call(this)
}

util.inherits(Lifx, events.EventEmitter)

exports.createLifx = function(){
  return new Lifx()
}

Lifx.prototype.start = function(options){
  this.options = options
  this.ruby = child_process.spawn('ruby', ['index.rb'])
  this.ruby.stdout.on('data', this.handleOut.bind(this))
  this.ruby.stderr.on('data', this.handleErr.bind(this))
}

Lifx.prototype.stop = function(fn){
  this.ruby.once('close', fn)
  this.ruby.kill()
}

Lifx.prototype.handleOut = function(str){
  var body, err
  try {
    body = JSON.parse(str.toString())
    this.emit(body.event, body.data)
  } catch(e) {
    err = new Error('Failed to parse JSON output from Ruby LIFX process: '+e.message)
    this.emit('error', err)
  }
}

Lifx.prototype.handleErr = function(str){
  var err = new Error('Error from Ruby LIFX process: '+str.toString())
  this.emit('error', err)
}

Lifx.prototype.send = function(payload, fn){
  return this.ruby.stdin.write(JSON.stringify(payload)+"\n", fn)
}