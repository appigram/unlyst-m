starterControllers

.controller('ListCtrl', ['$scope', '$rootScope', 'fireBaseData', '$firebase', 'utility',
  function ($scope, $rootScope, fireBaseData, $firebase, utility) {
    var homes = $firebase(fireBaseData.refHomes()).$asArray();
    $scope.$broadcast('updateauth');
    homes.$loaded().then(function () {
      var homeJson = JSON.parse(JSON.stringify(homes));
      $scope.homeList = homeJson;
      //TODO: refactor this and mainCtrl
      var authData = fireBaseData.ref().getAuth();
      if (authData) {
        var ref = fireBaseData.refUsers().child(authData.uid);
        ref.on("value", function (snap) {
          $rootScope.authData = snap.val();
          $rootScope.authData.userDisplayName = fireBaseData.getUserDisplayName($rootScope.authData);
          $rootScope.authData.userProfilePicture = fireBaseData.getUserProfilePicture($rootScope.authData);
          angular.forEach($scope.homeList, function (value, key) {
            //User has valued this home before
            var houseID = value.houseId + '';
            var valuedThisHome = utility.hasValuedPropertyBefore($rootScope.authData.valuations,houseID);
            value.valuedThisHome = valuedThisHome;
          });
        });
      }
    });
  }]);