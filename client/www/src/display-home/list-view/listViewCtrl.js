starterControllers

.controller('ListCtrl', ['$scope', '$rootScope', 'fireBaseData', '$firebase',
  function ($scope, $rootScope, fireBaseData, $firebase) {
    var homes = $firebase(fireBaseData.refHomes()).$asArray();
    homes.$loaded().then(function () {
      var homeJson = JSON.parse(JSON.stringify(homes));
      $scope.homeList = homeJson;
      //if ($rootScope.authData && !$rootScope.authData.admin) {
      //  //User has valued this home before
      //  $scope.property.valuedThisHome = utility.hasValuedPropertyBefore($rootScope.authData.valuations, $scope.property.houseId.toString());
      //}
    });
  }]);