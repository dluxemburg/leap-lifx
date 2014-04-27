var express = require('express'),
    Leap = require('leapjs'),
    app = express()
    server = require('http').createServer(app)
    io = require('socket.io').listen(server)
    lifx = require('./lib/lifx').createLifx({})
    leapLifx = require('./lib/leap-lifx').createLeapLifx({
      controller: new Leap.Controller()
    })

app.use(express.static(__dirname + '/static'));
io.set('log level', 2)

leapLifx.on('frame', function(frame){

  try {
    io.sockets.emit('frame', frame)
  } catch(e) {
    console.log('Failed to serialize frame: '+e.message)
  }

  if (frame.hands.length > 0) {
    lifx.post({hsl: frame.hands[0].hsl})
  }

})

server.listen(8888)
lifx.startServer()
leapLifx.start()


