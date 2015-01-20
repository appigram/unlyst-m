starterControllers

.controller('ModalCtrl', function ($scope, $mdDialog, valuation) {
  $scope.hide = function () {
    $mdDialog.hide();
    $scope.clickNext();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
    $scope.clickNext();
  };
  $scope.valuation = valuation;

})

.controller('HomeCtrl', function ($scope, $rootScope, fireBaseData, $ionicSlideBoxDelegate, utility, geocoding, $firebase,
                                  $location, $timeout, $mdDialog) {

  //bind model to scoep; set valuation
  $scope.home = {};
  $scope.home.valuation = 100000;
  $scope.score = 0;
  $scope.Math = window.Math;
  var admin = $location.search();
  //Used to in line edit the pictures
  $scope.AdminMode = admin.admin;

  $scope.map = {};
  $scope.defaultzoom = 15;
  //test mode
  $scope.stopRecording = false;

  var homesDB = fireBaseData.refHomes();
  var homesRef = $firebase(fireBaseData.refHomes()).$asArray();
  var valuationDB = fireBaseData.refValuation();
  //init firebase
  homesRef.$loaded().then(function () {

    var houses = utility.shuffle(homesRef);
    var i = 0;

    $scope.property = houses[i];
    $scope.likes = 20;
    $scope.buildYr = 2014 - $scope.property.buildYr;
    $scope.hideDetail = true;
    $scope.crowdvalue = $scope.property.crowdvalue;

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
    //need a timeout for slidebox to load so that tabs display correctly
    $timeout(function () {
      $ionicSlideBoxDelegate.update();
      $scope.$broadcast('updateTabs');
    }, 100);

    $scope.saveCaption = function (data, imgIndex) {
      var house = homesDB.child(houses[i].$id);
      var captionRef = 'img/' + imgIndex + '/caption';
      house.child(captionRef).set(data);
      $timeout(function () {
        $ionicSlideBoxDelegate.update();
        return true;
      }, 100)
    };

    if ($rootScope.authData != null) {
      var refUserRep = fireBaseData.refUsers().child($rootScope.authData.uid + '/reputation');
      refUserRep.on("value", function (snapshot) {
        console.log("updated value here:" + snapshot.val());
        if ($rootScope.authData != null) {
          $rootScope.authData.reputation = snapshot.val();
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
    $scope.valuation = {};

    $scope.submitScore = function () {
      $scope.valuation.crowdvalue = $scope.property.crowdvalue;
      $scope.valuation.score = 10 - Math.abs(($scope.crowdvalue - $scope.home.valuation) * 1.5 / $scope.crowdvalue * 10);
      if ($scope.valuation.score < 0) {
        $scope.valuation.score = 0;
      }
      console.log('your score:' + $scope.valuation.score);
      if (!$scope.stopRecording) {
        fireBaseData.saveValuation($scope.home.valuation, $scope.authData, $scope.property);
      }
    };

    //modal popup
    $scope.postValuationPopup = function (ev) {
      $mdDialog.show({
        controller: 'ModalCtrl',
        templateUrl: 'src/display-home/modal.html',
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

    $scope.clickNext = function () {

      $ionicSlideBoxDelegate.slide(0);
      $ionicSlideBoxDelegate.update();

      var length = houses.length;
      $scope.hideDetail = true;
      if (i < length - 1) {
        i++;
      } else {
        i = 0;
      }
      $scope.property = houses[i];
      $scope.likes = 20;
      $scope.buildYr = 2014 - $scope.property.buildYr;
      $scope.hideDetail = true;
      //prevent the next score to be shown
      //$scope.crowdvalue = $scope.property.crowdvalue;
      $scope.map.lat = $scope.property.lat;
      $scope.map.lng = $scope.property.lng;
      $scope.home.maxValuation = utility.maxCondoValue($scope.property.size);
      $scope.home.valuation = utility.defaultCondoValue($scope.property.size);
      $scope.$broadcast('updatemap', $scope.map);
      $scope.$broadcast('updateTabs', $scope.map);
    };

  });
});

