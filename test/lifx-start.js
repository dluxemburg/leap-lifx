var asset = require('assert'),
    should = require('should')

describe('Lifx', function(){

  describe('#start', function(){

    this.timeout(20000)

    it('will emit a "ready" event', function(done){

      var lifx = require('../lib/lifx').createLifx({minLights: 2})
      lifx.on('ready', function(ready){
        ready.lights.length.should.eql(2)
        done()
      })
      lifx.start()

    })

  })

})



