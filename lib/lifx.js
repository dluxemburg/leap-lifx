var events = require('events'),
    util = require('util'),
    child_process = require('child_process'),
    request = require('request')

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
  this.ruby.stderr.on('data', this.handleOut.bind(this))
}

Lifx.prototype.stop = function(fn){
  this.ruby.kill()
  this.ruby.once('close', fn)
}

Lifx.prototype.handleOut = function(str){
  str = str.toString()
  var match
  if (match = str.match(Lifx.SERVER_START_MATCH)) {
    this.pid = match[1]
    this.port = match[2]
    this.emit('started')
  }
}

Lifx.prototype.post = function(payload, fn){
  request({
    uri: 'http://localhost:8000/',
    method: 'POST',
    json: payload,
  }, function(err, resp, body){
    if (err) console.log('Error posting to LIFX server: '+err.message)
    if (fn) fn(err, body, resp)
  })
}

Lifx.SERVER_START_MATCH = /WEBrick::HTTPServer#start: pid=(\d+) port=(\d+)/