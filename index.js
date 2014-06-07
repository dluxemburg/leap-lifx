var express = require('express'),
    Leap = require('leapjs'),
    app = express()
    server = require('http').createServer(app)
    io = require('socket.io').listen(server)
    leapLifx = require('./lib/leap-lifx').createLeapLifx({
      controller: new Leap.Controller()
    })

var leftLifx = require('./lib/lifx').createLifx({
  minLights: 1,
  defaultLabel: 'Left'
})

var rightLifx = require('./lib/lifx').createLifx({
  minLights: 1,
  defaultLabel: 'Right'
})

var lifxs = [leftLifx, rightLifx]

app.use(express.static(__dirname + '/static'));
app.set('port', process.env.PORT || '8888')
io.set('log level', 2)

leapLifx.on('frame', function(frame){

  try {
    io.sockets.emit('frame', frame)
  } catch(e) {
    console.log('Failed to serialize frame: '+e.message)
  }

  frame.hands.forEach(function(hand, index){
    if(lifxs[index]) lifxs[index].hsl(hand.hsl)
  })

})

server.listen(app.settings.port, function(){
  console.log('App server listening at http://localhost:'+app.settings.port)
})

leftLifx.start()
rightLifx.start()
leapLifx.start()


