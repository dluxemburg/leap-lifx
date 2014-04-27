var events = require('events'),
    util = require('util'),
    _ = require('lodash')

var LeapLifx = exports.LeapLifx = function(options){
  this.controller = options.controller
  this.controller.on('frame', this.handleFrame.bind(this))
  this.palmExtremes = _.clone(LeapLifx.DEFAULT_PALM_EXTREMES)
  this.hsl = _.clone(LeapLifx.DEFAULT_HSL)
  this.lastFrameTime = 0
  events.EventEmitter.call(this)
}

util.inherits(LeapLifx, events.EventEmitter)

exports.createLeapLifx = function(options){
  return new LeapLifx(options)
}

LeapLifx.prototype.start = function(){
  this.controller.connect()
}

LeapLifx.prototype.handleFrame = function(frame){
  if (Date.now() - this.lastFrameTime < 250) return
  this.lastFrameTime = Date.now()
  frame = LeapLifx.sanitizeFame(frame)
  var hands = frame.hands.map(this.processHand.bind(this))
  frame = _.extend({}, frame, {hands: hands})
  this.emit('frame', frame)
}

LeapLifx.prototype.processHand = function(hand) {
  var palmData = this.processPalmPosition(hand.palmPosition)
  return _.extend({}, hand, palmData)
}

LeapLifx.prototype.processPalmPosition = function(palmPosition){
  var palmCoords = LeapLifx.mapToAxes(palmPosition)
  this.palmExtremes = LeapLifx.calibratePalmExtremes(palmCoords, this.palmExtremes)
  var colors = this.buildColors(palmCoords, this.palmExtremes)
  return _.extend({}, {palmCoords: palmCoords}, colors)
}

LeapLifx.prototype.buildColors = function(palmCoords, palmExtremes){
  var h = Math.round(LeapLifx.normalizeAxisValue('x', palmCoords, palmExtremes) * 360)
  var l = (Math.round(LeapLifx.normalizeAxisValue('y', palmCoords, palmExtremes) * 100))/100
  var s = (Math.round(LeapLifx.normalizeAxisValue('z', palmCoords, palmExtremes) * -100) + 100)/100

  this.hsl = [(h+this.hsl[0])/2,(s+this.hsl[1])/2,(l+this.hsl[2])/2]
  return {hsl: this.hsl}
}

LeapLifx.normalizeAxisValue = function(name, values, extremes){
  return (values[name] - extremes[name+'Min'])/(extremes[name+'Max'] - extremes[name+'Min'])
}

LeapLifx.calibratePalmExtremes = function(palmCoords, palmExtremes){
  LeapLifx.AXES.forEach(function(axis){
    if (palmCoords[axis] > palmExtremes[axis+'Max']) {
      palmExtremes[axis+'Max'] = palmCoords[axis]
    }
    if (palmCoords[axis] < palmExtremes[axis+'Min']) {
      palmExtremes[axis+'Min'] = palmCoords[axis]
    }
  })
  return palmExtremes
}

LeapLifx.mapToAxes = function(arr){
  return {x: arr[0], y: arr[1], z: arr[2]}
}

LeapLifx.sanitizeFame = function(frame){
  delete(frame.controller)
  LeapLifx.CIRCULAR_TYPES.forEach(function(cicularType){
    frame[cicularType] = frame[cicularType].map(function(instance){
      delete(instance.frame)
      return instance
    })
    if (frame[cicularType+'Map']) {
      Object.keys(frame[cicularType+'Map']).forEach(function(key){
        delete(frame[cicularType+'Map'][key].frame)
      })
    }
  })
  return frame
}

LeapLifx.AXES = ['x', 'y', 'z']
LeapLifx.CIRCULAR_TYPES = ['hands', 'fingers', 'pointables']
LeapLifx.DEFAULT_PALM_EXTREMES = {
  xMin: 0, xMax: 0,
  yMin: 0, yMax: 0,
  zMin: 0, zMax: 0
}
LeapLifx.DEFAULT_HSL = [0.5, 0.5, 180]