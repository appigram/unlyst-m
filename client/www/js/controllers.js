angular.module('starter.controllers', ["firebase"])

.controller('MapCtrl', function ($scope) {
  $scope.layers = {
    baselayers: {
      //If we want to switch to google maps or both:
      //googleRoadmap: {
      //  name: 'Google Streets',
      //  layerType: 'ROADMAP',
      //  type: 'google'
      //},
      mapbox_terrain: {
        "name": "Mapbox Terrain",
        "url": "http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZG9uZ21pbmdsaXkiLCJhIjoiQ2tnWV9BayJ9.HEq2tSy-Jvid21sQNIUBRQ",
        "type": "xyz",
        "layerOptions": {
          "apikey": "pk.eyJ1IjoiZG9uZ21pbmdsaXkiLCJhIjoiQ2tnWV9BayJ9.HEq2tSy-Jvid21sQNIUBRQ",
          "mapid": "dongmingliy.kgb4m90f"
        }
      }
    }
  };
  $scope.defaults = {
    scrollWheelZoom: false
  };

  $scope.$on('updatemap', function (event, args) {

    $scope.map = {
      lat: $scope.$parent.map.lat,
      lng: $scope.$parent.map.lng,
      zoom: $scope.$parent.defaultzoom
    };

    $scope.markers = {
      osloMarker: {
        lat: $scope.$parent.map.lat,
        lng: $scope.$parent.map.lng,
        focus: true,
        draggable: false
      }

    };
    setTimeout(function(){
      $scope.$apply();
    },0);
  });
})

.controller('HomeCtrl', function ($scope,houseDB, $ionicModal, $ionicSlideBoxDelegate,valuationDB,utility) {
  $scope.activeSlide = 3;
  //bind model to scoep; set valuation
  $scope.home = {};
  $scope.home.valuation = 100000;
  $scope.score = 0;
  $scope.Math = window.Math;

  $scope.map = {};
  $scope.defaultzoom = 15;
  //test mode
  $scope.stopRecording = false;
  //init firebase
  houseDB.$loaded().then(function () {

    var houses = utility.shuffle(houseDB);
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
    $scope.getDefaultValue = function() {
      //need the timeout and apply to make it work
      setTimeout(function(){
        $scope.home.valuation = utility.defaultCondoValue(houses[i].size);
        $scope.$apply();
      },100);
    };
    $scope.getDefaultValue();
    $scope.$broadcast('updateMap',$scope.map);
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
      $scope.home.valuation = utility.defaultCondoValue(houses[i].size);
      if(!$scope.stopRecording) {
        valuationDB.child(houses[i].$id).push(parseInt($scope.home.valuation));
      }
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
      $scope.hideDetail = true;
      //need a delay so the next home's value won't be displayed while the modal hides itself
      //there should a better way to do this
      setTimeout(function () {
        //prevent the next score to be shown
        if (i < length - 1) {
          i++;
          $scope.property = houses[i];
          $scope.likes = 20;
          $scope.buildYr = 2014 - $scope.property.buildYr;
          $scope.hideDetail = true;
          $scope.crowdvalue = $scope.property.crowdvalue;
          $scope.map.lat = $scope.property.lat;
          $scope.map.lng = $scope.property.lng;
          $scope.home.maxValuation = utility.maxCondoValue($scope.property.size);
          $scope.home.valuation = utility.defaultCondoValue($scope.property.size);
        }
        else {
          i = 0;
          $scope.property = houses[i];
          $scope.likes = 20;
          $scope.buildYr = 2014 - $scope.property.buildYr;
          $scope.hideDetail = true;
          $scope.crowdvalue = $scope.property.crowdvalue;
          $scope.map.lat = $scope.property.lat;
          $scope.map.lng = $scope.property.lng;
          $scope.home.maxValuation = utility.maxCondoValue($scope.property.size);
          $scope.home.valuation = utility.defaultCondoValue($scope.property.size);
        }
        $scope.$broadcast('updatemap',$scope.map);
      }, 100);

    };
  });

});