starterControllers
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
  });
})

.controller('HomeCtrl', function ($scope, fireBaseData, $ionicModal, $ionicSlideBoxDelegate, utility, $firebase, $location, $timeout) {
  
  $scope.activeSlide = 0;
  
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
    $ionicModal.fromTemplateUrl('view/buyer/modal.html', function (modal) {
      $scope.modal = modal;

    }, {
      // Use our scope for the scope of the modal to keep it simple
      scope: $scope,
      // The animation we want to use for the modal entrance
      animation: 'fade-in'
    });

    $scope.saveCaption = function (data, imgIndex) {
      var house = homesDB.child(houses[i].$id);
      var captionRef = 'img/' + imgIndex + '/caption';
      house.child(captionRef).set(data);
      $timeout(function () {
        $ionicSlideBoxDelegate.update();
        return true;
      }, 100)
    }

    $scope.totalScore = $scope.playCount = 0;

    $scope.submitScore = function () {
      $scope.crowdvalue = $scope.property.crowdvalue;
      $scope.score = 10 - Math.abs(($scope.crowdvalue - $scope.home.valuation) * 1.5 / $scope.crowdvalue * 10);
      if ($scope.score < 0) {
        $scope.score = 0;
      }
      $scope.totalScore += $scope.score;
      $scope.playCount++;
      $scope.avgScore = $scope.totalScore / $scope.playCount;
      if (!$scope.stopRecording) {
        valuationDB.child(houses[i].$id).push(parseInt($scope.home.valuation));
        // 2.5 means off by 50%
        if ($scope.score > 2) {

          var house = homesDB.child(houses[i].$id);
          var reputationRef = '/totalReputation';
          //TODO: move score calculation to ultility
          var newrepuationTotal = houses[i].totalReputation + $scope.score * 10;
          var crowdRef = '/crowdvalue';
          var newCrowdValue = (houses[i].crowdvalue * houses[i].totalReputation +
          $scope.home.valuation * $scope.score * 10) / newrepuationTotal;
          console.log('your valuation:' + $scope.home.valuation);
          console.log('old crowd value:' + $scope.crowdvalue);
          console.log('new crowd value:' + newCrowdValue);
          house.child(reputationRef).set(newrepuationTotal);
          house.child(crowdRef).set(newCrowdValue);
        }
      }
    };
      
    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous();
    };

    $ionicSlideBoxDelegate.update();
    
    // Called each time the slide changes
    $scope.slideHasChanged = function (index) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.activeSlide = index;
      $ionicSlideBoxDelegate.update();
      updateTabs();
    };

    //for tabs showing correctly
    var numSlides = 0;
    $scope.curPhotoSlide = $scope.curInfoSlide = '';
    var updateTabs = function() {
        //$ionicSlideBoxDelegate.update();
        numSlides = $ionicSlideBoxDelegate.count();
        $scope.curPhotoSlide = $scope.curInfoSlide = '';
        if(isPhotoSlide()) {
            var curSlide = $scope.activeSlide + 1;
            $scope.curPhotoSlide = curSlide + '/' + $scope.property.img.length;
        }
        else if(isInfoSlide()) {
            var curSlide = $scope.activeSlide - $scope.property.img.length + 1;
            $scope.curInfoSlide = curSlide + '/' + 3;
        }
    }
    
    var isPhotoSlide = function() {
        return $scope.activeSlide < numSlides - 3 - 1; 
    }
    var isInfoSlide = function() {
        return $scope.activeSlide < numSlides - 1 
            && $scope.activeSlide >= numSlides - 3 - 1;
    }
    
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

      updateTabs();
    };
      
    //need a timeout for slidebox to load so that tabs display correctly 
    setTimeout(function(){   
      $ionicSlideBoxDelegate.update();
      updateTabs();
    },100);
      
  });
})

.controller('AddHomeCtrl', function ($scope, $state) {

  console.log("AddHomeCtrl");
  $scope.address = "";
  $scope.suiteNumber = "";
  $scope.hideAddress = false;
  $scope.test = $scope.address + ":" + $scope.suiteNumber + ":" + $scope.hideAddress;

  $scope.goToPg2 = function () {
    $state.go('addHome2');
  };

})
