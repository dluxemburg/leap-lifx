var child_process = require('child_process'),
    request = require('request')

var Lifx = exports.Lifx = function(){}

exports.createLifx = function(){
  return new Lifx()
}

Lifx.prototype.startServer = function(){
  this.ruby = child_process.spawn('ruby', ['index.rb'])
}

Lifx.prototype.post = function(payload, fn){
  request({
    uri: 'http://localhost:8000/',
    method: 'POST',
    json: payload,
  }, function(err,resp,body){
    if (err) console.log('Error posting to LIFX server: '+err.message)
    if (fn) fn(err, body)
  })
}