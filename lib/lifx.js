var events = require('events'),
    util = require('util'),
    child_process = require('child_process'),
    _ = require('lodash')

var Lifx = exports.Lifx = function(options){
  options || (options = {})
  this.options = options
  this.errLines = []
  events.EventEmitter.call(this)
}

util.inherits(Lifx, events.EventEmitter)

exports.createLifx = function(options){
  return new Lifx(options)
}

Lifx.prototype.start = function(){
  var minLights = (this.options.minLights || 2)
  var args = ['lib/ruby/lifx-client.rb', minLights]
  if (this.options.defaultLabel) {
    args.push(this.options.defaultLabel)
  }
  this.ruby = child_process.spawn('ruby', args)
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
  } catch(e) {
    console.log(str.toString())
    err = new Error("Failed to parse JSON output from Ruby LIFX process ("+str.toString()+"): "+e.message)
    // this.emit('error', err)
  }
  if (err) return
  if (body.event == 'ready') {
    var message = ''
    if (this.options.defaultLabel) {
      message = "'"+this.options.defaultLabel+"' "
    }
    message += 'LIFX ready!'
    console.log(message)
    this.ready = true
  }
  this.emit(body.event, body.data)
}

Lifx.prototype.handleErr = function(str){
  this.errLines.push(str.toString())
  if(this.errLines.length > 1){
    var err = new Error('Error from Ruby LIFX process: '+this.errLines.join(' '))
    this.emit('error', err)
  }
}

Lifx.prototype.send = function(color, duration, fn){
  if (!this.ready) return
  var payload = _.merge({color: color}, this.defaultPayload())
  return this.ruby.stdin.write(JSON.stringify(payload)+"\n", fn)
}

Lifx.prototype.hsl = function(arr, duration){
  this.send(['hsl'].concat(arr), null, function(){})
}

Lifx.prototype.defaultPayload = function(){
  if (this.options.defaultLabel) {
    return {label: this.options.defaultLabel}
  } else {
    return {}
  }
}