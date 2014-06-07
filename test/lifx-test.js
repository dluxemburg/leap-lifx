var should = require('should'),
    assert = require('assert'),
    Lifx = require('../lib/lifx').Lifx

describe('Lifx', function(){

  this.timeout(20000)

  it("starts a server", function(done){
    var lifx = new Lifx()
    lifx.on('ready',function(){
      lifx.send({color: ['hsl',1,2,4]})
    })
    lifx.on('response', function(body){
      body.color.should.eql(['hsl',1,2,4])
      lifx.stop(done)
    })
    lifx.start()
  })

})
