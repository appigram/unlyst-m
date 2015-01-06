angular.module('starter.controllers', [])
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
    setTimeout(function () {
      $scope.$apply();
    }, 0);
  });
})

.controller('HomeCtrl', function ($scope, houseDB, $ionicModal, $ionicSlideBoxDelegate, valuationDB, utility, $firebase, $location) {
  $scope.activeSlide = 3;
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

  var sync = $firebase(houseDB);
  var houseRef = sync.$asArray();

  //init firebase
  houseRef.$loaded().then(function () {

    var houses = utility.shuffle(houseRef);
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
      //need the timeout and apply to make it work
      setTimeout(function () {
        $scope.home.valuation = utility.defaultCondoValue(houses[i].size);
        $scope.$apply();
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
      var house = houseDB.child(houses[i].$id);
      var captionRef = 'img/' + imgIndex + '/caption';
      house.child(captionRef).set(data);
      setTimeout(function () {
        $ionicSlideBoxDelegate.update();
        return true;
      }, 100)
    }

    $scope.totalScore = $scope.playCount = 0;

    $scope.submitScore = function () {
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
          var house = houseDB.child(houses[i].$id);
          var reputationRef = '/totalReputation';
          var newrepuationTotal = houseRef[i].totalReputation + $scope.score * 10;
          var crowdRef = '/crowdvalue';
          var newCrowdValue = (houseRef[i].crowdvalue * houseRef[i].totalReputation +
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
        $scope.$broadcast('updatemap', $scope.map);
      }, 100);

    };
  });
})

.controller('AddHomeCtrl', ['$scope', '$http', '$state', function($scope, $http, $state, imageDB) {

  console.log("AddHomeCtrl");
  $scope.homeSchema = {
    homeTypes : [
      {
        name: "Condominium",
        value: "condominium"
      },
      {
        name: "Semi-datached House",
        value: "semiHouse"
      },
      {
        name: "Detached House",
        value: "detachedHouse"
      },
      {
        name: "Townhouse",
        value: "townHouse"
      }
    ],
    buildingTypes : [
      {
        name: "High-rise",
        value: "highRise"
      },
      {
        name: "Mid-rise",
        value: "midRise"
      },
      {
        name: "Low-rise",
        value: "lowRise"
      }
    ],
    bedRooms: [0,1,2,3,4],
    bathRooms: [0,1,2,3,4],
    additionalSpace: ['Den','Sunroom'],
    parkingType: [
      {
        name: "n/a",
        value: "na"
      },
      {
        name: "Underground Garage",
        value: "underGroundGrg"
      },
      {
        name: "Above Ground Garage",
        value: "AboveGroundGrg"
      },
      {
        name: "Driveway",
        value: "driveway"
      }
    ],
    parkingSpace: [0,1,2,3,4],
    outdoorSpace: [
      {
        name: "Balcony",
        value: "balcony"
      },
      {
        name: "Terrace",
        value: "terrace"
      },
      {
        name: "Juliet balcony",
        value: "julietBalcony"
      }
    ],
    orientation: ["North", "East", "South","West"],
    amenity: [
      {
        name: "Pool",
        value: "pool"
      },
      {
        name: "Gym",
        value: "gym"
      },
      {
        name: "Sauna",
        value: "sauna"
      },
      {
        name: "Steam",
        value: "steam"
      },
      {
        name: "Spa",
        value: "spa"
      },
      {
        name: "Rooftop",
        value: "rooftop"
      },
      {
        name: "BBQ",
        value: "bbq"
      },
      {
        name: "Pet Wash",
        value: "petWash"
      },
      {
        name: "Concierge",
        value: "concierge"
      },
      {
        name: "Party Room",
        value: "partyRoom"
      }
    ]
  };

  $scope.home = {
    address: "",
    suiteNumber : "",
    city : "Toronto",
    province:"ON",
    postalCode: "",
    neighborhood: "",
    hideAddress: false,
    homeType: $scope.homeSchema.homeTypes[0].value,
    buildingType: $scope.homeSchema.buildingTypes[0].value,
    buildingName: "",
    size: '',
    bedroomNum: $scope.homeSchema.bedRooms[0],
    bathroomNum: $scope.homeSchema.bathRooms[0],
    additionalSpace: [],
    parkingType: $scope.homeSchema.parkingType[0].value,
    parkingSpace: 0,
    storageLocker: false,
    outdoorSpace:[],
    orientation:[],
    amenity: [],
    yearBuilt: '',
    maintenanceFee: ''
  };

  $scope.toggleSelection = function(item, selectionArr) {
    var idx = selectionArr.indexOf(item);
    // is currently selected
    if (idx > -1) {
      selectionArr.splice(idx, 1);
    }
    // is newly selected
    else {
      selectionArr.push(item)
    }
  };

  $scope.goToPg2 = function () {
    $state.go('addHome2');
  };
  $scope.goToPg3 = function () {
    $state.go('addHome3');
  };
  $scope.addhome = function () {
    console.log("add home");
    $state.go('home');
  };

  $scope.uploadFiles = [];
  $scope.uploadFile = function(files){
    var fd = new FormData();
    fd.append("file", files[0]);
    $scope.uploadFiles.push(fd);
  };
      
  $scope.uploadImg = function () {
    for (var i = 0; i < $scope.uploadFiles.length; i++) {
      var file = $scope.uploadFiles[i];
      console.log(file);
      if(file) {
        var req = {
          url:'/upload',
          data: file,
          method: 'POST',
          withCredentials:true,
          headers: {'Content-Type': undefined},
          transformRequest: angular.identity
        };

        $http(req).success(function(data) {
          console.log("OK", data);
        }).error(function(err){
          console.log(err);
        });
      }
      else {
        // No File Selected
        alert('No File Selected');
      }
    }

  };

}]);