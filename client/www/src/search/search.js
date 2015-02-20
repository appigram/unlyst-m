starterControllers

.controller('SearchCtrl', function ($scope, $rootScope, fireBaseData, $ionicPopover, $ionicHistory, $state, $mdSidenav) {
  $scope.search = {};
  $scope.bedrooms = ['any','1','2','3','4','5+'];
  $scope.bathrooms = ['any','1','2','3','4','5+'];
  $scope.searchHomes = function() {
  	$state.go('searchResult', $scope.search);
  }
})

.controller('searchResultCtrl', ['$scope', '$rootScope', 'fireBaseData', '$firebase', 'utility', '$stateParams',
  function ($scope, $rootScope, fireBaseData, $firebase, utility, $stateParams) {
    var homes = $firebase(fireBaseData.refHomes()).$asArray();
    $scope.title = "Search Result";

    var filterHome = function(property, searchObj) {
      var filterLocation = (searchObj.location) ? (property.address === searchObj.location || property.postalCode === searchObj.location || property.neighborhood === searchObj.location) : true;
      var filterPrice = (searchObj.maxPrice) ? (property.crowdvalue <= searchObj.maxPrice) : true;
      var filterSpace = (searchObj.squarefoot) ? (property.size >= searchObj.squarefoot) : true;
      var filterBedroom = (searchObj.bedrooms && searchObj.bedrooms != 'any') ? (property.bedroomNum == searchObj.bedrooms) : true;
      var filterBathroom = (searchObj.bathrooms && searchObj.bathrooms != 'any') ? (property.bathroomNum == searchObj.bathrooms) : true;   
      return filterLocation && filterPrice && filterSpace && filterBedroom && filterBathroom;        
    }

    homes.$loaded().then(function () {
      var homeJson = JSON.parse(JSON.stringify(homes));
      $scope.homeList = homeJson;
      var authData = fireBaseData.ref().getAuth();
      if (authData) {
        var ref = fireBaseData.refUsers().child(authData.uid);
        ref.on("value", function (snap) {
          $rootScope.authData = snap.val();
          $rootScope.authData.userDisplayName = fireBaseData.getUserDisplayName($rootScope.authData);
          $rootScope.authData.userProfilePicture = fireBaseData.getUserProfilePicture($rootScope.authData);
          angular.forEach($scope.homeList, function (value, key) {
            value.valuedThisHome = filterHome(value, $stateParams);
          });
        });
      }
    });
  }]);