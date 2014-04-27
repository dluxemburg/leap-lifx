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
app.set('port', process.env.PORT || '8888')
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

server.listen(app.settings.port, function(){
  console.log('App server listening at http://localhost:'+app.settings.port)
})
lifx.startServer()
leapLifx.start()


