starterControllers

.controller('SearchCtrl', function ($scope, $rootScope, fireBaseData, $ionicPopover, $ionicHistory, $state, $mdSidenav) {
  $scope.search = {};
  $scope.selectedBed = "foo";
  $scope.bedrooms = ["foo", "bar"];
  $scope.select = "foo";
  $scope.list = ["foo", "bar"];
});