angular.module('LeapLifx', ['ngMaterial'])
  .controller('LeapLifxController', function($http) {
    $http.get('/state').then(response => {
      this.state = response.data;
    });
  });
