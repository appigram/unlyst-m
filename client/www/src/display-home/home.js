starterControllers

.controller('HomeCtrl', function ($scope, $rootScope, fireBaseData, $ionicSlideBoxDelegate, utility, $firebase,
                                  $location, $timeout, $mdDialog, $state) {
//  console.log('HomeCtrl');
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
  //init firebase
  homesRef.$loaded().then(function () {

    var houses = utility.shuffle(homesRef);
    var i = 0;
    console.log('HomeCtrl');
    $state.go('home.display', { 'id' : houses[i].$id });
    $rootScope.homeID = houses[i].$id;
    $scope.property = houses[i];
    $scope.hideDetail = true;
    if($scope.property.suiteNumber){
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
    }



    $scope.valuation = {};

    $scope.submitScore = function () {
      $scope.valuation.crowdvalue = $scope.property.crowdvalue;
      $scope.valuation.accuracy = utility.getAccuracy($scope.home.valuation, $scope.property.crowdvalue);
      $scope.valuation.reputation = 'N/A';
        
      if (!$scope.stopRecording && $scope.authData) {
        if(!$scope.property.crowdvalue){
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

    //modal popup
    $scope.postValuationPopup = function (ev) {
      if(!$scope.property.crowdvalue){
        return;
      }
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
        $rootScope.notify('You have valued all homes on unlyst!');
        i = 0;
      }
      //if user already reached their trial or they just reached their trial
      if (($rootScope.reachedTrial === true  && !$scope.authData) || (i % 4 === 3 && !$scope.authData)) {
        $rootScope.reachedTrial = true;
        $state.go('login');
        $rootScope.notify('Now that you are a pro at valuing homes, sign up to start tracking your reputation score!');
        return;
      }
      $state.go('home.display', { 'id' : houses[i].$id });

      $scope.property = houses[i];
      $scope.hideDetail = true;
      $scope.map.lat = $scope.property.lat;
      $scope.map.lng = $scope.property.lng;

      if($scope.property.suiteNumber){
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
});

