angular.module('starter.controllers', ["firebase"])

.factory('houseDB', ["$firebase", function ($firebase) {
  var ref = new Firebase("https://fiery-heat-1976.firebaseio.com/unlyst/");
  var sync = $firebase(ref);
  return sync.$asArray();
}
])

.factory('valuationDB', ["$firebase", function () {
  var ref = new Firebase("https://fiery-heat-1976.firebaseio.com/valuations");
  return ref;
}
])

.controller('DashCtrl', function ($scope) {
})

.controller('FriendsCtrl', function ($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function ($scope) {
})

.controller('HomeCtrl', function ($scope, houseDB, $ionicModal, $ionicSlideBoxDelegate,valuationDB) {
  $scope.activeSlide = 3;
  //bind model to scoep; set valuation
  $scope.home = {};

  $scope.valuation = $scope.home.valuation;
  $scope.score = 0;
  $scope.Math = window.Math;
  $scope.totalScore = 0;
  $scope.playCount = 0;
  $scope.avgScore = 0;

  $scope.toronto = {};
  $scope.markers = {};
  $scope.layers = {
    baselayers: {
      googleRoadmap: {
        name: 'Google Streets',
        layerType: 'ROADMAP',
        type: 'google'
      }
    }
  };
  $scope.defaults = {
    scrollWheelZoom: false
  };

  //init firebase
  houseDB.$loaded().then(function () {
    var houses = houseDB;
    var i = 0;
    $scope.likes = 20;
    $scope.imgurl = houses[i].img;
    $scope.bedRmNum = houses[i].bedRmNum;
    $scope.bathRmNum = houses[i].bathRmNum;
    $scope.houseType = houses[i].houseType;
    $scope.houseSize = houses[i].size;
    $scope.lotSize = houses[i].landSize;
    $scope.stories = houses[i].stories;
    $scope.orientation = houses[i].orientation;
    $scope.parking = houses[i].parkingNum;
    $scope.parkingType = houses[i].parkingType;
    $scope.outdoorSpace = houses[i].outdoorSpace;
    $scope.buildYr = 2014 - houses[i].buildYr;
    $scope.address = houses[i].address1;
    $scope.neighborhood = houses[i].neighborhood;
    $scope.city = houses[i].city;
    $scope.hideDetail = true;
    $scope.expertvalue = houses[i].expertvalue;
    $scope.crowdvalue = houses[i].crowdvalue;
    $scope.lat = houses[i].lat;
    $scope.lng = houses[i].lng;
    $scope.toronto = {
      lat: $scope.lat,
      lng: $scope.lng,
      zoom: 12
    };
    $scope.markers = {
      osloMarker: {
        lat: $scope.lat,
        lng: $scope.lng,
        //message: "WalkScore:98",
        focus: true,
        draggable: false
      }
    };

    $ionicModal.fromTemplateUrl('templates/modal.html', function (modal) {
      $scope.modal = modal;

    }, {
      // Use our scope for the scope of the modal to keep it simple
      scope: $scope
      // The animation we want to use for the modal entrance
      //animation: 'slide-in-up'
    });
    $scope.submitScore = function () {
      $scope.score = 10 - Math.abs(($scope.crowdvalue - $scope.home.valuation) * 1.5 / $scope.crowdvalue * 10);
      if ($scope.score < 0) {
        $scope.score = 0;
      }
      $scope.totalScore += $scope.score;
      $scope.playCount++;
      $scope.avgScore = $scope.totalScore / $scope.playCount;
      valuationDB.child(i).push(parseInt($scope.home.valuation));
    };

    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous();
    };

    $scope.activeSlide = 3;
    $ionicSlideBoxDelegate.update();


    // Called each time the slide changes
    $scope.slideHasChanged = function (index) {
      $scope.activeSlide = index;
      $ionicSlideBoxDelegate.update();
    };

    $scope.slideToIndex = function (index) {
      $ionicSlideBoxDelegate.slide(index);
      $ionicSlideBoxDelegate.update();
    };
    $scope.$on('modal.hidden', function () {
      //$scope.clickNext();
    });

    $scope.clickNext = function () {
      setTimeout(function () {
        //hack: need to call slide twice because images are in ng-repeat's css is not applied.
        $ionicSlideBoxDelegate.slide(2);
        $ionicSlideBoxDelegate.slide(3);
        $ionicSlideBoxDelegate.update();
      }, 200);

      var length = houses.length;
      console.log("no: " + i);
      $scope.hideDetail = true;
      //need a delay so the next home's value won't be displayed while the modal hides itself
      //there should a better way to do this
      setTimeout(function () {
        //prevent the next score to be shown
        if (i < length - 1) {
          i++;
          $scope.likes = 20;
          $scope.imgurl = houses[i].img;
          $scope.bedRmNum = houses[i].bedRmNum;
          $scope.bathRmNum = houses[i].bathRmNum;
          $scope.houseType = houses[i].houseType;
          $scope.houseSize = houses[i].size;
          $scope.lotSize = houses[i].landSize;
          $scope.stories = houses[i].stories;
          $scope.orientation = houses[i].orientation;
          $scope.parking = houses[i].parkingNum;
          $scope.parkingType = houses[i].parkingType;
          $scope.outdoorSpace = houses[i].outdoorSpace;
          $scope.buildYr = 2014 - houses[i].buildYr;
          $scope.address = houses[i].address1;
          $scope.neighborhood = houses[i].neighborhood;
          $scope.city = houses[i].city;
          $scope.hideDetail = true;
          $scope.expertvalue = houses[i].expertvalue;
          $scope.crowdvalue = houses[i].crowdvalue;
          $scope.lat = houses[i].lat;
          $scope.lng = houses[i].lng;
          $scope.toronto = {
            lat: $scope.lat,
            lng: $scope.lng,
            zoom: 12
          };
          $scope.markers = {
            osloMarker: {
              lat: $scope.lat,
              lng: $scope.lng,
              //message: "WalkScore:98",
              focus: true,
              draggable: false
            }
          };
        }
        else {
          i = 0;
          $scope.likes = 20;
          $scope.imgurl = houses[i].img;
          $scope.bedRmNum = houses[i].bedRmNum;
          $scope.bathRmNum = houses[i].bathRmNum;
          $scope.houseType = houses[i].houseType;
          $scope.houseSize = houses[i].size;
          $scope.lotSize = houses[i].landSize;
          $scope.stories = houses[i].stories;
          $scope.orientation = houses[i].orientation;
          $scope.parking = houses[i].parkingNum;
          $scope.parkingType = houses[i].parkingType;
          $scope.outdoorSpace = houses[i].outdoorSpace;
          $scope.buildYr = 2014 - houses[i].buildYr;
          $scope.address = houses[i].address1;
          $scope.neighborhood = houses[i].neighborhood;
          $scope.city = houses[i].city;
          $scope.hideDetail = true;
          $scope.expertvalue = houses[i].expertvalue;
          $scope.crowdvalue = houses[i].crowdvalue;
          $scope.lat = houses[i].lat;
          $scope.lng = houses[i].lng;
          $scope.toronto = {
            lat: $scope.lat,
            lng: $scope.lng,
            zoom: 12
          };
          $scope.markers = {
            osloMarker: {
              lat: $scope.lat,
              lng: $scope.lng,
              //message: "WalkScore:98",
              focus: true,
              draggable: false
            }
          };
        }
      }, 100);

    };
  });

});