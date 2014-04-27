var should = require('should'),
    assert = require('assert'),
    Lifx = require('../lib/lifx').Lifx

describe('Lifx', function(){

  it("starts a server", function(done){
    var lifx = new Lifx()
    lifx.on('started',function(){
      lifx.send({hsl: [1,2,4]})
    })
    lifx.on('response', function(body){
      body.should.eql({hsl: [1,2,4]})
      lifx.stop(done)
    })
    lifx.start()
  })

})
