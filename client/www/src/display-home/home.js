starterControllers

.controller('HomeCtrl', ['$scope', '$rootScope', 'fireBaseData', '$ionicSlideBoxDelegate', 'utility', '$firebase',
  '$location', '$timeout', '$mdDialog', '$state', 'homeSchema', function ($scope, $rootScope, fireBaseData,
  $ionicSlideBoxDelegate, utility, $firebase, $location, $timeout, $mdDialog, $state, homeSchema) {
    console.log('Home Ctrl');
    //bind model to scoep; set valuation
    $scope.home = {};
    $scope.home.valuation = 100000;
    $scope.score = 0;
    $scope.Math = window.Math;
    //Used to in line edit the pictures
    if($rootScope.authData && $rootScope.authData.admin){
      $scope.AdminMode = $rootScope.authData.admin;
    }
    $scope.map = {};
    $scope.defaultzoom = 15;
    //test mode
    $scope.stopRecording = false;
    var homesDB = fireBaseData.refHomes();
    var homesRef = $firebase(fireBaseData.refHomes()).$asArray();
    //init firebase
    homesRef.$loaded().then(function () {

      var shuffled = utility.shuffle(homesRef);
      //We clone the object to prevent firebase's 3-way data binding. It messes up slidebox css and we don't need that feature.
      var houses = JSON.parse(JSON.stringify(shuffled));

      var i = 0;
      $state.go('home.display', {'id': houses[i].$id});
      $rootScope.homeID = houses[i].$id;
      $scope.property = houses[i];
      $scope.hideDetail = true;

      //property naming handle here:
      //this won't work on IE8 or earlier version
      $scope.property.homeType = searchForObjName(homeSchema.homeTypes, $scope.property.homeType);

      var outdoorSpaceArr = [];
      for (var j = 0; j< $scope.property.outdoorSpace.length; j++) {
        outdoorSpaceArr.push(searchForObjName(homeSchema.outdoorSpace, $scope.property.outdoorSpace[i]));
      }

      $scope.property.outdoorSpace = outdoorSpaceArr;

      $scope.property.parkingType = searchForObjName(homeSchema.parkingType, $scope.property.parkingType);

      if ($scope.property.suiteNumber) {
        $scope.property.addressString = $scope.property.suiteNumber + ' - ' + $scope.property.address;
      } else {
        $scope.property.addressString = $scope.property.address;
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
        //need the timeout to make it work
        $timeout(function () {
          $scope.home.valuation = utility.defaultCondoValue(houses[i].size);
        }, 100);
      };
      $scope.getDefaultValue();

      $scope.$broadcast('updateMap', $scope.map);
      $ionicSlideBoxDelegate.update();
      $scope.$broadcast('updateTabs');

      $scope.saveCaption = function (data, imgIndex) {
        var house = homesDB.child(houses[i].$id);
        var captionRef = 'img/' + imgIndex + '/caption';
        house.child(captionRef).set(data);
        $timeout(function () {
          $ionicSlideBoxDelegate.update();
          return true;
        }, 100);
      };

      //post valuation modal popup
      var postValuationPopup = function () {
        if (!$scope.property.crowdvalue) {
          return;
        }
        $mdDialog.show({
          controller: 'ModalCtrl',
          templateUrl: 'src/display-home/post-valuation-modal.html',
          locals: {
            valuation: $scope.valuation
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
          templateUrl: 'src/display-home/no-more-homes.html',
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
          var oldReputation = $scope.authData.reputation || 10;
          fireBaseData.saveValuation($scope.home.valuation, $scope.authData, $scope.property);
          var change = ($scope.authData.reputation - oldReputation).toFixed(1);
          $scope.valuation.reputation = $scope.authData.reputation.toFixed(1);
          $scope.valuation.reputationChange = (change < 0) ? '(' + change + ')' : '(+' + change + ')';
        }
      };
      $scope.skip = function(){
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
        $scope.clickNext();
      };

      $scope.clickNext = function () {

        var length = houses.length;
        $scope.hideDetail = true;

        if (i < length - 1) {
          i++;
        } else {
          noMoreHomesPopup();
          i = 0;
        }
        //if user already reached their trial or they just reached their trial
        if (($rootScope.reachedTrial === true && !$scope.authData) || (i % 4 === 3 && !$scope.authData)) {
          $rootScope.reachedTrial = true;
          $state.go('login');
          $rootScope.notify('Now that you are a pro at valuing homes, sign up to start tracking your reputation score!');
          return;
        }
        $state.go('home.display', {'id': houses[i].$id});
        $rootScope.homeID = houses[i].$id;
        $scope.property = houses[i];
        $scope.hideDetail = true;
        $scope.map.lat = $scope.property.lat;
        $scope.map.lng = $scope.property.lng;

        if ($scope.property.suiteNumber) {
          $scope.property.addressString = $scope.property.suiteNumber + ' - ' + $scope.property.address;
        } else {
          $scope.property.addressString = $scope.property.address;
        }
        $scope.home.maxValuation = utility.maxCondoValue($scope.property.size);
        $scope.home.valuation = utility.defaultCondoValue($scope.property.size);
        $scope.$broadcast('updatemap', $scope.map);
        $scope.$broadcast('updateTabs');

      };

    });

    var searchForObjName = function(arr, name) {
     return  arr.filter(function(obj){
        return obj.value === name;
      })[0].name;
    }
  }]);

