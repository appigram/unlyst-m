starterControllers

.controller('HomeCtrl', ['$scope', '$rootScope', 'fireBaseData', '$ionicSlideBoxDelegate', 'utility', '$firebase',
  '$location', '$timeout', '$mdDialog', '$state', '$stateParams', 'homeSchema',
  function ($scope, $rootScope, fireBaseData, $ionicSlideBoxDelegate, utility, $firebase, $location, $timeout, $mdDialog,
            $state, $stateParams, homeSchema) {
    //bind model to scope; set valuation
    $scope.home = {};

    $scope.map = {};
    $scope.defaultzoom = 15;
    //test mode
    $scope.stopRecording = false;
    var homesDB = fireBaseData.refHomes();
    //store and shuffle the list of homes in rootscope
    if (!$rootScope.homes) {
      $rootScope.homes = {};
      $rootScope.homes.homesRef = $firebase(fireBaseData.refHomes()).$asArray();
    }
    $rootScope.homes.homesRef.$loaded().then(function () {
      if ($rootScope.authData && $rootScope.authData.admin) {
        $scope.AdminMode = $rootScope.authData.admin;
      }
      if (!$rootScope.homes.shuffled) {
        utility.shuffle($rootScope.homes.homesRef);
        $rootScope.homes.shuffled = true;
        $rootScope.homes.indexes = {};
        $rootScope.homes.valued = 0;
        for (var i = 0; i < $rootScope.homes.homesRef.length; i += 1) {
          $rootScope.homes.indexes[$rootScope.homes.homesRef[i].houseId] = i;
        }
      }
      //We clone the object to prevent firebase's 3-way data binding. It messes up slidebox css and we don't need that feature.
      var houses = JSON.parse(JSON.stringify($rootScope.homes.homesRef));

      var i = 0;
      if (!$stateParams.id || !($stateParams.id in $rootScope.homes.indexes)) {
        $state.go('home', {'id': houses[i].houseId});
        return;
      }
      var i = $rootScope.homes.indexes[$stateParams.id];
      $rootScope.homes.current = $stateParams.id;
      $scope.property = houses[i];
      $scope.hideDetail = true;

      if ($rootScope.authData && !$rootScope.authData.admin) {
        //User has valued this home before
        $scope.property.valuedThisHome = utility.hasValuedPropertyBefore($rootScope.authData.valuations, $scope.property.houseId.toString());
      }
      $scope.map = {
        lat: $scope.property.lat,
        lng: $scope.property.lng,
        zoom: $scope.defaultzoom
      };
      $scope.markers = {
        osloMarker: {
          lat: $scope.property.lat,
          lng: $scope.property.lng,
          focus: true,
          draggable: false
        }
      };
      $scope.valuation = {};
      //price slider
      $scope.home.minValuation = 100000;
      $scope.home.maxValuation = utility.maxCondoValue(houses[i].size);

      // need to use this method and ng-init to bind the initial value. There's a bug in the range slider in ionic.
      $scope.getDefaultValue = function () {
        $scope.home.valuation = 100000;
      };
      $scope.getDefaultValue();

      //property naming handle here:
      //this won't work on IE8 or earlier version
      $scope.property.homeType = searchForObjName(homeSchema.homeTypes, $scope.property.homeType);

      var outdoorSpaceArr = [];
      if ($scope.property.outdoorSpace) {
        for (var j = 0; j < $scope.property.outdoorSpace.length; j++) {
          outdoorSpaceArr.push(searchForObjName(homeSchema.outdoorSpace, $scope.property.outdoorSpace[j]));
        }
      }
      $scope.property.outdoorSpace = outdoorSpaceArr;
      $scope.property.parkingType = searchForObjName(homeSchema.parkingType, $scope.property.parkingType);

      $scope.$broadcast('updateMap', $scope.map);
      $ionicSlideBoxDelegate.update();
      $scope.$broadcast('updateTabs');

      $scope.saveCaption = function (data, imageIndex) {
        var house = homesDB.child(houses[i].houseId);
        var captionRef = 'img/' + imageIndex + '/caption';
        house.child(captionRef).set(data);
        $timeout(function () {
          $ionicSlideBoxDelegate.update();
          return true;
        }, 100);
      }

      //post valuation modal popup
      var postValuationPopup = function () {
        if (!$scope.property.crowdvalue) {
          return;
        }
        $mdDialog.show({
          controller: 'ModalCtrl',
          templateUrl: 'src/display-home/modal-dialogs/post-valuation.html',
          locals: {
            valuation: $scope.valuation,
            houseId: $scope.property.houseId
          }
        })
        .then(function () {
          $scope.clickNext();
        }, function () {
          $scope.clickNext();
        });
      };

      //no more homes popup
      var noMoreHomesPopup = function () {
        $mdDialog.show({
          controller: 'ModalCtrl',
          templateUrl: 'src/display-home/modal-dialogs/no-more-homes.html',
          locals: {
            valuation: $scope.valuation
          }
        })
        .then(function () {
          //log something in user profile
          $scope.stopRecording = true;
        }, function () {
          $scope.stopRecording = true;
        });
      };

      $scope.submitScore = function () {
        $scope.valuation.crowdvalue = $scope.property.crowdvalue;
        $scope.valuation.accuracy = utility.getAccuracy($scope.home.valuation, $scope.property.crowdvalue);
        $scope.valuation.reputation = 'N/A';
        postValuationPopup();
        if (!$scope.stopRecording && $scope.authData) {
          if (!$scope.property.crowdvalue) {
            $rootScope.notify('This property has not been evaluated. Please continue to the next home.');
            return;
          }
          if (!$rootScope.authData.admin) {
            //User has valued this home before
            $scope.property.valuedThisHome = true;
          }
          var oldReputation = $scope.authData.reputation || 10;
          fireBaseData.saveValuation($scope.home.valuation, $scope.authData, $scope.property);
          var change = ($scope.authData.reputation - oldReputation).toFixed(1);
          $scope.valuation.reputation = $scope.authData.reputation.toFixed(1);
          $scope.valuation.reputationChange = (change < 0) ? '(' + change + ')' : '(+' + change + ')';
        }
        $rootScope.homes.valued += 1;
      };
      $scope.skip = function () {
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
        $scope.clickNext();
      }

      $scope.clickNext = function () {
        var length = houses.length;
        $scope.hideDetail = true;
        i = (i + 1) % length;
        if ($rootScope.homes.valued >= length) {
          noMoreHomesPopup();
        }
        //if user already reached their trial or they just reached their trial
        if (($rootScope.reachedTrial === true && !$scope.authData) || ($rootScope.homes.valued % 4 === 3 && !$scope.authData)) {
          $rootScope.reachedTrial = true;
          $state.go('login');
          $rootScope.notify('Now that you are a pro at valuing homes, sign up to start tracking your reputation score!');
        } else {
          $state.go('home', {'id': houses[i].houseId});
        }
      }
    });

    var searchForObjName = function (arr, name) {
      var results = arr.filter(function (obj) {
        return obj.value === name;
      })[0];
      if (results) {
        return results.name;
      }
      return null
    }
  }]);

