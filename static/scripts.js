angular.module('LeapLifx',[])
.controller('LeapLifxCtrl', function($scope){
  $scope.greeting = 'Hello'
  $scope.data = {}

  window.socket = $scope.socket = io.connect()

  $scope.socket.on('reload', function(){
    document.location.reload()
  })

  $scope.socket.on('frame', function (frame) {
    $scope.frame = frame
    $scope.hands = frame.hands.map(function(hand){
      hand.palmPosition = hand.palmPosition.map(function(pos){
        return (""+pos).substring(0,6)
      })
      hand.palmNormal = hand.palmNormal.map(function(pos){
        return (""+pos).substring(0,6)
      })


      return angular.extend({
        fingerCount: hand.fingers.length,
      }, hand)
    })

    $scope.$apply()
  })

})