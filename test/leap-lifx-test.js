var should = require('should'),
    assert = require('assert'),
    LeapLifx = require('../lib/leap-lifx').LeapLifx

describe('LeapLifx', function(){

  describe('.normalizeAxisValue()', function(){
    it('returns a normalized value', function(){
      LeapLifx.normalizeAxisValue('x', {x: 7}, {xMin: 2, xMax: 12}).should.eql(0.5)
    })
  })

  describe('.calibratePalmExtremes()', function(){
    it('sets the max value', function(){
      LeapLifx.calibratePalmExtremes({x: 7}, {xMin: 2, xMax: 5}).should.eql({xMin: 2, xMax: 7})
    })

    it('sets the min value', function(){
      LeapLifx.calibratePalmExtremes({x: 3}, {xMin: 5, xMax: 6}).should.eql({xMin: 3, xMax: 6})
    })

    it('does nothing for an included value', function(){
      LeapLifx.calibratePalmExtremes({x: 5}, {xMin: 3, xMax: 7}).should.eql({xMin: 3, xMax: 7})
    })
  })

  describe('.mapToAxes()', function(){
    it('maps an array to an object', function(){
      LeapLifx.mapToAxes([2,5,0.1]).should.eql({x: 2, y: 5, z: 0.1})
    })
  })

  describe('.sanitizeFame()', function(){

    var getFrame = function(){
      return {
        controller: 'controller',
        hands: [{frame: 'frame', other: 'value'}],
        fingers: [{frame: 'frame', other: 'value'}],
        pointables: [{frame: 'frame', other: 'value'}]
      }
    }

    it('deletes the controller reference', function(){
      var frame = getFrame()
      assert.equal(frame.controller, 'controller')
      frame = LeapLifx.sanitizeFame(frame)
      assert.equal(frame.controller, undefined)
    })

    it('deletes the frame references', function(){
      var frame = getFrame()
      assert.equal(frame.hands[0].frame, 'frame')
      assert.equal(frame.fingers[0].frame, 'frame')
      assert.equal(frame.pointables[0].frame, 'frame')
      frame = LeapLifx.sanitizeFame(frame)
      assert.equal(frame.hands[0].frame, undefined)
      assert.equal(frame.fingers[0].frame, undefined)
      assert.equal(frame.pointables[0].frame, undefined)
    })

    it('does not delete other values', function(){
      var frame = getFrame()
      frame.hands[0].other.should.eql('value')
      frame = LeapLifx.sanitizeFame(frame)
      frame.hands[0].other.should.eql('value')
    })
  })

})
