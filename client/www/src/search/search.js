starterControllers

.controller('SearchCtrl', function ($scope, $rootScope, fireBaseData, $ionicPopover, $ionicHistory, $state, $mdSidenav) {
  $scope.search = {};
  $scope.bedrooms = ['any','1','2','3','4','5+'];
  $scope.bathrooms = ['any','1','2','3','4','5+'];
});