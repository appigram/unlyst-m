starterControllers

.controller('SearchCtrl', function ($scope, $rootScope, fireBaseData, $ionicPopover, $ionicHistory, $state, $mdSidenav) {
  $scope.search = {};
  $scope.bedrooms = ['1','2','3','4','5+'];
  $scope.bathrooms = ['1','2','3','4','5+'];
  $scope.onlyNumbers = /^\d+$/;
});