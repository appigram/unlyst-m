// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic','starter.routes', 'starter.controllers', 'starter.services',
  'starter.filters',  'starter.directives', 'ui.router', 'firebase', 'leaflet-directive', 'xeditable','angulartics',
  'angulartics.google.analytics', 'ngMaterial']);

var starterControllers = angular.module('starter.controllers', []);

starter
//interceptor for http request. Show loading icon.
.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
      request: function (config) {
        $rootScope.$broadcast('loading:show');
        return config;
      },
      response: function (response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      }
    }
  })
})

.run(function ($rootScope, $ionicLoading,$ionicPopup) {
  $rootScope.$on('loading:show', function () {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  });

  $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide();
  });

  $rootScope.notify = function(title,text) {
    var alertPopup = $ionicPopup.alert({
      title: title ? title : 'Error',
      template: text
    });
  };

  $rootScope.hide = function (text) {
    $ionicLoading.hide();
  };

  $rootScope.show = function (text) {
    $rootScope.loading = $ionicLoading.show({
      template: '<i class="icon ion-looping"></i><br>' + text,
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };
})
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryColor('blue');
})

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(typeof analytics !== "undefined") {
      analytics.startTrackerWithId("UA-57937417-1");
    } else {
      console.log("Google Analytics Unavailable for IOS/Android");
    }
  })
});




angular.module('starter.directives', [])
.directive('noScroll', function ($document) {

  return {
    restrict: 'A',
    link: function ($scope, $element, $attr) {

      $document.on('touchmove', function (e) {
        e.preventDefault();
      });
    }
  }
});

angular.module('starter.filters',[])

.filter('noFractionCurrency',
['$filter', '$locale',
  function (filter, locale) {
    var currencyFilter = filter('currency');
    var formats = locale.NUMBER_FORMATS;
    return function (amount, currencySymbol) {
      var value = currencyFilter(amount, currencySymbol);
      var sep = value.indexOf(formats.DECIMAL_SEP);
      if (amount >= 0) {
        return value.substring(0, sep);
      }
      return value.substring(0, sep) + ')';
    };
  }])

.filter('scoreMessage', [function () {
  return function (score) {
    var scoreMsg = [
      'Sorry, we can’t count that estimate', //0
      'Are you even trying?',
      'Yikes, you’re way off',
      'Think of this as a learning round', //3
      'Don’t get out much?',
      'You’ve got it in you!',
      'Okay, you’re getting the hang of this',//5
      'A solid valuation',
      'You’re a star',
      'That was so close!',//9
      'Nailed it!'];
    var scoreAdjusted = Math.round(score);
    return scoreMsg[scoreAdjusted];
  }
}]);
angular.module('starter.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    // Each tab has its own nav history stack:

  .state('home', {
    url: '/',
    templateUrl: 'view/buyer/home.html',
    controller: 'HomeCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'view/user/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'view/user/register.html',
    controller: 'RegisterCtrl'
  })

  .state('addHome', {
    url: '/addHome',
    templateUrl: 'view/seller/addhome.html',
    controller: 'AddHomeCtrl'
   })

   .state('addHome.addHome1', {
     url: '/addHome1',
     templateUrl: 'view/seller/addhome1.html'
      })

  .state('addHome.addHome2', {
    url: '/addHome2',
    templateUrl: 'view/seller/addhome2.html'
  })
      
  .state('addHome.addHome3', {
    url: '/addHome3',
    templateUrl: 'view/seller/addhome3.html'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  //remove # from url
  //had to comment this out because ionic server does not supply html5mode. We'll need to use our custom node server to do this.
  //$locationProvider.html5Mode(true).hashPrefix('!');

});
angular.module('starter.services', [])

.factory('fireBaseData', ["$firebase", function ($firebase, $rootScope) {
  //gulp-preprocess to change FIREBASE to production URL see root/gulpfile.js
  //Do not remove the comments below.
  var homeInfo;
  var valuationData;
  var refUserConfig;
  var refConfig = 'https://fiery-heat-1976.firebaseio.com';

  /* @if NODE_ENV='production' */
  homeInfo = 'https://fiery-heat-1976.firebaseio.com/unlyst/';
  valuationData = 'https://fiery-heat-1976.firebaseio.com/valuations-prod';
  refUserConfig = "https://fiery-heat-1976.firebaseio.com/user/";
  /* @endif */

  /* @if NODE_ENV='development' */
  homeInfo = 'https://fiery-heat-1976.firebaseio.com/unlyst-test/';
  valuationData = 'https://fiery-heat-1976.firebaseio.com/valuations';
  refUserConfig = "https://fiery-heat-1976.firebaseio.com/user-test/";
  /* @endif */

  var ref = new Firebase(refConfig);
  var refHomes = new Firebase(homeInfo);
  var refValuation = new Firebase(valuationData);
  var refUser = new Firebase(refUserConfig);

  return {
    ref: function () {
      return ref;
    },
    refValuation: function () {
      return refValuation;
    },
    refHomes: function () {
      return refHomes;
    },
    refUsers: function () {
      return refUser;
    },
    saveValuation: function saveValuation(valuation, authData, property) {

      if (refUser == null || authData == null) {
        return;
      }

      if (authData.reputation == null) {
        authData.reputation = 0;
      }

      var accuracy = 100 - Math.abs((property.crowdvalue - valuation) / property.crowdvalue) * 100;

      if (accuracy < 0) {
        accuracy = 0;
      }

      var valuation = {
        "created": Firebase.ServerValue.TIMESTAMP,
        "homeID": property.$id,
        "homeValue": property.crowdvalue,
        "homeReputation": property.totalReputation,
        "userID": authData.uid,
        "userSubmittedValue": parseInt(valuation),
        "userReputation": authData.reputation,
        "accuracy": accuracy
      };
      console.log(accuracy);

      var newrepuationTotal = property.totalReputation + accuracy;
      //Each valuation can assign a score from 0-10. Use 7 as the base, so the maximum score of a valuation is 0-3.
      // log base 1.1 seems like a good place to start
//      var userReputation;
//      var adjustedScore;
//      if (accuracy - 70 <= 0) {
//        adjustedScore = 0;
//      } else {
//        adjustedScore = (accuracy - 70) / 10;
//        console.log("adjusted score: " + adjustedScore);
//        userReputation = Math.log(adjustedScore + authData.reputation) / Math.log(1.1);
//        //if total reputation is less than 1, it will be negative
//        if (userReputation == null || userReputation < 0) {
//          userReputation = 0;
//        }
//      }
        
      //paramaters used to update reputation
      var base = 1.1,
          scale = 1.2,
          passAccuracy = 70,
          maxReputation = 100;
      // adjuststed score between -30 and 30
      var adjustedScore = accuracy - passAccuracy;
      if (adjustedScore < passAccuracy - 100) {
          adjustedScore = passAccuracy - 100;
      }
      // add new score to previous total 
      var userScore = (authData.reputation) ? Math.pow(base, authData.reputation/scale) + adjustedScore : adjustedScore;
      if (userScore < base) {
         userScore = base;
      }
      // recompute reputation with log
      var userReputation = Math.log(userScore) / Math.log(base) * scale;
      if (userReputation > maxReputation) {
          userReputation = maxReputation;
      }
        
      console.log("old reputation: " + authData.reputation);
      console.log("user new reputation: " + userReputation);

      refValuation.push(valuation);
      refUser.child(authData.uid + '/valuations').push(valuation);
      refUser.child(authData.uid + '/reputation').set(userReputation);
      refHomes.child(property.$id + '/valuations').push(valuation);
      refHomes.child(property.$id + '/totalReputation').set(newrepuationTotal);
      return 1;
    }
  };
}])

.factory('utility', [function ($scope) {
  return {
    shuffle: function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    defaultCondoValue: function calculateDefaultValue(size) {
      return size * 500;
    },
    maxCondoValue: function calculateDefaultValue(size) {
      //var randomScale = window.Math.floor((window.Math.random() * -0.2) + 0.2);
      if (size * 1000 > 1000000) {
        return size * 1000;
      }
      //mininum value of 1 mil
      return 1000000;
    }
  }
}])

.factory('geocoding', [function ($scope){
    var geocoder = new google.maps.Geocoder();
    //hard coded for now
    var city = 'Toronto';
    // geocoding API request
    var getResult = function(processResult) {
        return function (address, callback) {
            address = address + ', ' + city;
            console.log('address: ' + address);
            geocoder.geocode( { 'address': address}, function(results, status) {
                var result;
                if (status == google.maps.GeocoderStatus.OK) {
                    result = processResult(results);
                } else {
                    console.log(status);
                }
                if ( typeof callback == 'function') {
                    callback(result);
                }
            });
        }
    };
    var parseResult = function(results) {
        var coordinates = results[0].geometry.location;
        var components = results[0].address_components;
        var postal_code, neighborhood;
        for (var i = 0; i < components.length; i+=1) {
            if(components[i].types.indexOf('neighborhood') >= 0) {
                neighborhood = components[i].long_name;
            }
            if(components[i].types.indexOf('postal_code') >= 0) {
                postal_code = components[i].long_name;
            }
        }
        return {
            lat: coordinates.lat(),
            lng: coordinates.lng(),
            postal_code: postal_code,
            neighborhood: neighborhood,
            full_address: results[0].formatted_address
        }
    };
    return {
        //getData will find lat, lng, postalcode, neighbohood of a given address
        getData: getResult(parseResult)
    }
}])

.factory('homeSchema', [function ($scope) {
      var homeSchema = {
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
        additionalSpace: ['Den','study', 'Sunroom', 'Storage locker'],
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
            name: "Concierge(24 hour)",
            value: "conciergeFullTime"
          },
          {
            name: "Concierge(Part-time)",
            value: "conciergePartTime"
          },
          {
            name: "Party Room",
            value: "partyRoom"
          }
        ],
        lat:0,
        lng:0
      };
      return homeSchema;
}]);

starterControllers

.controller('HeaderCtrl', function ($scope, $rootScope, fireBaseData, $ionicPopover, $ionicHistory, $state) {
  //authentication
  $rootScope.authData = fireBaseData.ref().getAuth();
  $rootScope.getUserDisplayName = function () {
    if ($rootScope.authData === null) {
      return null;
    }
    else if ($rootScope.authData.provider === 'google') {
      return $rootScope.authData.google.displayName.split(' ')[0];
    }
    else if ($rootScope.authData.provider === 'facebook') {
      return $rootScope.userDisplayName = $rootScope.authData.facebook.displayName.split(' ')[0];
    }
    else if ($rootScope.authData.provider === 'twitter') {
      return $rootScope.authData.twitter.displayName.split(' ')[0];
    }
    else if ($rootScope.authData.provider === 'password') {
      if ($rootScope.authData.user == null) {
        return '';
      }
      return $rootScope.authData.user.firstname;
    }
  };

  //console.log($rootScope.authData);
  $ionicPopover.fromTemplateUrl('view/user/popover.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.popover = popover;
  });
  /* LOGOUT BUTTON */
  $rootScope.logout = function () {
    $ionicHistory.clearCache();
    fireBaseData.ref().unauth();
    $rootScope.checkSession();
    $rootScope.notify("Logged out successfully!");
    $scope.popover.hide();
  };

  $rootScope.checkSession = function () {
    $rootScope.authData = fireBaseData.ref().getAuth();
    $rootScope.hide();
    $state.go('home');

  };
});


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
        templateUrl: 'view/buyer/modal.html',
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
})

.controller('AddHomeCtrl', ['$scope', '$http', '$state', '$firebase', 'fireBaseData', 'homeSchema', function ($scope, $http, $state, $firebase, fireBaseData, homeSchema) {

  console.log("AddHomeCtrl");
  $state.go("addHome.addHome1");
  var homesDB = fireBaseData.refHomes();
  var homesRef = $firebase(homesDB).$asArray();

  $scope.homeSchema = homeSchema;
  console.log(homeSchema);
  $scope.home = {
    address: "",
    suiteNumber: "",
    city: "Toronto",
    province: "ON",
    postalCode: "",
    neighborhood: "",
    hideAddress: false,
    ownerCertify: false,
    homeType: $scope.homeSchema.homeTypes[0].value,
    buildingType: $scope.homeSchema.buildingTypes[0].value,
    buildingName: "",
    size: '',
    bedroomNum: $scope.homeSchema.bedRooms[0],
    bathroomNum: $scope.homeSchema.bathRooms[0],
    additionalSpace: [],
    parkingType: $scope.homeSchema.parkingType[0].value,
    parkingSpace: 0,
    outdoorSpace: [],
    orientation: [],
    amenity: [],
    yearBuilt: '',
    maintenanceFee: '',
    houseId: -1,
    img: []
  };

  $scope.uploadFiles = [];

  $scope.uploadFile = function (files) {
    console.log(files[0]);
    var fd = new FormData();
    fd.append("file", files[0]);
    $scope.uploadFiles.push(fd);
  };

        //put upload function and inside promise
  homesRef.$loaded().then(function() {
          console.log("load homeref ....")
          var length = homesRef.length;
          var id = homesRef[length-1].houseId;
          if (id >= length-1 ){
            //set houseID for new home
            $scope.home.houseId  = id + 1;
            //prepare for image upload
            $scope.uploadFile = function(files, name){
              console.log(files);
              console.log("houseID: " + $scope.home.houseId);
              console.log(files[0]);
              var fd = new FormData();
              fd.append("file", files[0]);
              fd.append("houseId", $scope.home.houseId);
              fd.append("imageNum",name);
              $scope.uploadFiles.push(fd);
            };

            $scope.submitForm = function () {
              for (var i = 0; i < $scope.uploadFiles.length; i++) {
                var file = $scope.uploadFiles[i];
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
                    var imgObj = {
                      caption:'',
                      url: ''
                    };
                    console.log("OK", data);
                    imgObj.url = data;
                    $scope.home.img.push ({
                                             "caption" : "",
                                              "url" : data
                                            });
                    //start to push.....
                    //homesDB.child($scope.home.houseId).set($scope.home)
                    homesRef.$add($scope.home).then(function(ref){
                      console.log("return is:  " + ref);
                    });
                  }).error(function(err){
                    console.log(err);
                  });
                } else {
                  // No File Selected
                  alert('No File Selected');
                }
              }
            };
          } else {
            console.log("Error: house ID is not correct!")
          }

        });



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
        console.log("gotopage2");
        $state.go('addHome.addHome2');
      };
      $scope.goToPg3 = function () {
        console.log("goto hom3");
        $state.go('addHome.addHome3');
      };
      $scope.addhome = function () {
        console.log("add home");
        $state.go('addHome.addHome1');
      };

      $scope.submitHomes = function () {
      };
}]);
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
});
starterControllers

.controller('SliderCtrl', function ($scope,$rootScope, $ionicSlideBoxDelegate) {
  $scope.activeSlide = 0;
  $scope.next = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };

  $ionicSlideBoxDelegate.update();

  var updateTabs =function () {
    numSlides = $ionicSlideBoxDelegate.count();
    $scope.curPhotoSlide = $scope.curInfoSlide = '';
    if (isPhotoSlide()) {
      var curSlide = $scope.activeSlide + 1;
      $scope.curPhotoSlide = curSlide + '/' + $scope.property.img.length;
    }
    else if (isInfoSlide()) {
      var curSlide = $scope.activeSlide - $scope.property.img.length + 1;
      $scope.curInfoSlide = curSlide + '/' + 3;
    }
  };

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


  var isPhotoSlide = function () {
    return $scope.activeSlide < numSlides - 3 - 1;
  }
  var isInfoSlide = function () {
    return $scope.activeSlide < numSlides - 1
    && $scope.activeSlide >= numSlides - 3 - 1;
  }

});
starterControllers

.controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, fireBaseData, $timeout) {

  $scope.hideBackButton = true;

  $rootScope.user = {};
  $rootScope.user.username = $scope.user.username;
  $rootScope.user.password = $scope.user.password;

  function onLoginSuccess(authData) {
    saveUserProfile(authData);
    $rootScope.notify("Authenticated successfully!");
    $rootScope.userid = authData.id;
    $rootScope.authData = authData;
    $rootScope.$apply();
    $rootScope.hide();
    $state.go('home');
  }

  function saveUserProfile( authData) {
    authData.updated = Firebase.ServerValue.TIMESTAMP;
    /* SAVE PROFILE DATA */
    var usersRef = fireBaseData.refUsers();
    //use uid as ID, if the user logs in again, we simply update the profile instead of creating a new one
    usersRef.child(authData.uid).set(authData);

  };
  //TODO: make sure users cannot log in again after already logged in. only log out.

  $scope.signIn = function (user) {
    $rootScope.show('Logging In...');

    /* Check user fields*/
    if (!user || !user.email || !user.password) {
      $rootScope.notify('Error', 'Email or Password is incorrect!');
      return;
    }

    /* All good, let's authentify */
    fireBaseData.ref().authWithPassword({
      email: user.email,
      password: user.password
    }, function (error, authData) {
      if (error === null) {
        onLoginSuccess(authData);
      } else {
        switch (error.code) {
          case "INVALID_EMAIL":
            $rootScope.notify("The specified user account email is invalid.");
            break;
          case "INVALID_PASSWORD":
            $rootScope.notify("The specified user account password is incorrect.");
            break;
          case "INVALID_USER":
            $rootScope.notify("The specified user account does not exist.");
            break;
          default:
            $rootScope.notify("Error logging user in:", error);

        }
        $rootScope.hide();
        $rootScope.notify('Error', 'Email or Password is incorrect!');
      }
    });
  };

  $scope.facebookLogin = function () {

    fireBaseData.ref().authWithOAuthPopup("facebook", function (error, authData) {
      if (error) {
        $rootScope.notify("Login Failed!", error);
      } else {
        onLoginSuccess(authData);
      }
    }, {
      scope: "email,public_profile,user_games_activity,user_location"
    });
  };

  $scope.googleLogin = function () {
    fireBaseData.ref().authWithOAuthPopup("google", function (error, authData) {
      if (error) {
        $rootScope.notify("Login Failed!", error);
      } else {
        onLoginSuccess(authData);
      }
    }, {
      scope: "email,profile"
    });
  };
  $scope.twitterLogin = function () {
    fireBaseData.ref().authWithOAuthPopup("twitter", function (error, authData) {
      if (error) {
        $rootScope.notify("Login Failed!", error);
      } else {
        onLoginSuccess(authData);
      }
    });
  };

})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $firebase, fireBaseData, $firebaseAuth, $http) {
  $scope.hideBackButton = true;

  $scope.createUser = function (user) {
    var firstname = user.firstname;
    var surname = user.surname;
    var email = user.email;
    var password = user.password;
    
    if (!firstname || !surname || !email || !password) {
      $rootScope.notify("Please enter valid credentials");
      return false;
    }
    $rootScope.show('Registering...');

    var auth = $firebaseAuth(fireBaseData.ref());
    var saveUserProfile = function (authData) {
      authData.updated = Firebase.ServerValue.TIMESTAMP;
      var temp = {};
      temp.firstname = user.firstname;
      temp.lastname = user.surname;
      authData.user = temp;
      /* SAVE PROFILE DATA */
      var usersRef = fireBaseData.refUsers();
      usersRef.child(authData.uid).set(authData, function () {
        $rootScope.hide();
        $state.go('login')
        $rootScope.notify('Enter your email and password to login. ');
        ;
      });
    };
    var sendEmail = function() {
        var req = {
            url: '/sendmail',
            method: 'POST',
            data: {'email': email},
            headers: {'Content-Type': 'application/json'},
        };
        $http(req).success(function(res) {
          if (res && res[0].status == 'sent') {
            console.log('email sent to ' + res[0].email);
          } else {
            console.log('email not sent');
          }
        }).error(function(err){
          console.log(err);
        });
    }
    auth.$createUser(email, password).then(function (error) {
      return auth.$authWithPassword({
        email: email,
        password: password
      });
    })
    .then(saveUserProfile)
    .then(sendEmail)
    .catch(function (error) {
      $rootScope.hide();
      if (error.code == 'INVALID_EMAIL') {

        $rootScope.notify('Error', 'Invalid Email.');
      }
      else if (error.code == 'EMAIL_TAKEN') {
        $rootScope.notify('Error', 'Email already taken.');
      }
      else {
        $rootScope.notify('Error', 'Oops. Something went wrong.');
      }
    });
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRpcmVjdGl2ZXMuanMiLCJmaWx0ZXJzLmpzIiwicm91dGVzLmpzIiwic2VydmljZXMuanMiLCJjb250cm9sbGVycy9oZWFkZXIuanMiLCJjb250cm9sbGVycy9ob21lLmpzIiwiY29udHJvbGxlcnMvbWFwLmpzIiwiY29udHJvbGxlcnMvc2xpZGVyLmpzIiwiY29udHJvbGxlcnMvdXNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ1bmx5c3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xudmFyIHN0YXJ0ZXIgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLCdzdGFydGVyLnJvdXRlcycsICdzdGFydGVyLmNvbnRyb2xsZXJzJywgJ3N0YXJ0ZXIuc2VydmljZXMnLFxuICAnc3RhcnRlci5maWx0ZXJzJywgICdzdGFydGVyLmRpcmVjdGl2ZXMnLCAndWkucm91dGVyJywgJ2ZpcmViYXNlJywgJ2xlYWZsZXQtZGlyZWN0aXZlJywgJ3hlZGl0YWJsZScsJ2FuZ3VsYXJ0aWNzJyxcbiAgJ2FuZ3VsYXJ0aWNzLmdvb2dsZS5hbmFseXRpY3MnLCAnbmdNYXRlcmlhbCddKTtcblxudmFyIHN0YXJ0ZXJDb250cm9sbGVycyA9IGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJywgW10pO1xuXG5zdGFydGVyXG4vL2ludGVyY2VwdG9yIGZvciBodHRwIHJlcXVlc3QuIFNob3cgbG9hZGluZyBpY29uLlxuLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdsb2FkaW5nOnNob3cnKTtcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgIH0sXG4gICAgICByZXNwb25zZTogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9hZGluZzpoaWRlJyk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KVxuXG4ucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkaW9uaWNMb2FkaW5nLCRpb25pY1BvcHVwKSB7XG4gICRyb290U2NvcGUuJG9uKCdsb2FkaW5nOnNob3cnLCBmdW5jdGlvbiAoKSB7XG4gICAgJGlvbmljTG9hZGluZy5zaG93KHtcbiAgICAgIGNvbnRlbnQ6ICdMb2FkaW5nJyxcbiAgICAgIGFuaW1hdGlvbjogJ2ZhZGUtaW4nLFxuICAgICAgc2hvd0JhY2tkcm9wOiB0cnVlLFxuICAgICAgbWF4V2lkdGg6IDIwMCxcbiAgICAgIHNob3dEZWxheTogMFxuICAgIH0pO1xuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignbG9hZGluZzpoaWRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gIH0pO1xuXG4gICRyb290U2NvcGUubm90aWZ5ID0gZnVuY3Rpb24odGl0bGUsdGV4dCkge1xuICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgdGl0bGU6IHRpdGxlID8gdGl0bGUgOiAnRXJyb3InLFxuICAgICAgdGVtcGxhdGU6IHRleHRcbiAgICB9KTtcbiAgfTtcblxuICAkcm9vdFNjb3BlLmhpZGUgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICB9O1xuXG4gICRyb290U2NvcGUuc2hvdyA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgJHJvb3RTY29wZS5sb2FkaW5nID0gJGlvbmljTG9hZGluZy5zaG93KHtcbiAgICAgIHRlbXBsYXRlOiAnPGkgY2xhc3M9XCJpY29uIGlvbi1sb29waW5nXCI+PC9pPjxicj4nICsgdGV4dCxcbiAgICAgIGFuaW1hdGlvbjogJ2ZhZGUtaW4nLFxuICAgICAgc2hvd0JhY2tkcm9wOiB0cnVlLFxuICAgICAgbWF4V2lkdGg6IDIwMCxcbiAgICAgIHNob3dEZWxheTogMFxuICAgIH0pO1xuICB9O1xufSlcbi5jb25maWcoZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG4gIC5wcmltYXJ5Q29sb3IoJ2JsdWUnKTtcbn0pXG5cbi5ydW4oZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZih0eXBlb2YgYW5hbHl0aWNzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBhbmFseXRpY3Muc3RhcnRUcmFja2VyV2l0aElkKFwiVUEtNTc5Mzc0MTctMVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJHb29nbGUgQW5hbHl0aWNzIFVuYXZhaWxhYmxlIGZvciBJT1MvQW5kcm9pZFwiKTtcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cbiIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmRpcmVjdGl2ZXMnLCBbXSlcbi5kaXJlY3RpdmUoJ25vU2Nyb2xsJywgZnVuY3Rpb24gKCRkb2N1bWVudCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHIpIHtcblxuICAgICAgJGRvY3VtZW50Lm9uKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuZmlsdGVycycsW10pXG5cbi5maWx0ZXIoJ25vRnJhY3Rpb25DdXJyZW5jeScsXG5bJyRmaWx0ZXInLCAnJGxvY2FsZScsXG4gIGZ1bmN0aW9uIChmaWx0ZXIsIGxvY2FsZSkge1xuICAgIHZhciBjdXJyZW5jeUZpbHRlciA9IGZpbHRlcignY3VycmVuY3knKTtcbiAgICB2YXIgZm9ybWF0cyA9IGxvY2FsZS5OVU1CRVJfRk9STUFUUztcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFtb3VudCwgY3VycmVuY3lTeW1ib2wpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGN1cnJlbmN5RmlsdGVyKGFtb3VudCwgY3VycmVuY3lTeW1ib2wpO1xuICAgICAgdmFyIHNlcCA9IHZhbHVlLmluZGV4T2YoZm9ybWF0cy5ERUNJTUFMX1NFUCk7XG4gICAgICBpZiAoYW1vdW50ID49IDApIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnN1YnN0cmluZygwLCBzZXApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlLnN1YnN0cmluZygwLCBzZXApICsgJyknO1xuICAgIH07XG4gIH1dKVxuXG4uZmlsdGVyKCdzY29yZU1lc3NhZ2UnLCBbZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHNjb3JlKSB7XG4gICAgdmFyIHNjb3JlTXNnID0gW1xuICAgICAgJ1NvcnJ5LCB3ZSBjYW7igJl0IGNvdW50IHRoYXQgZXN0aW1hdGUnLCAvLzBcbiAgICAgICdBcmUgeW91IGV2ZW4gdHJ5aW5nPycsXG4gICAgICAnWWlrZXMsIHlvdeKAmXJlIHdheSBvZmYnLFxuICAgICAgJ1RoaW5rIG9mIHRoaXMgYXMgYSBsZWFybmluZyByb3VuZCcsIC8vM1xuICAgICAgJ0RvbuKAmXQgZ2V0IG91dCBtdWNoPycsXG4gICAgICAnWW914oCZdmUgZ290IGl0IGluIHlvdSEnLFxuICAgICAgJ09rYXksIHlvdeKAmXJlIGdldHRpbmcgdGhlIGhhbmcgb2YgdGhpcycsLy81XG4gICAgICAnQSBzb2xpZCB2YWx1YXRpb24nLFxuICAgICAgJ1lvdeKAmXJlIGEgc3RhcicsXG4gICAgICAnVGhhdCB3YXMgc28gY2xvc2UhJywvLzlcbiAgICAgICdOYWlsZWQgaXQhJ107XG4gICAgdmFyIHNjb3JlQWRqdXN0ZWQgPSBNYXRoLnJvdW5kKHNjb3JlKTtcbiAgICByZXR1cm4gc2NvcmVNc2dbc2NvcmVBZGp1c3RlZF07XG4gIH1cbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5yb3V0ZXMnLCBbXSlcblxuLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblxuICAuc3RhdGUoJ2hvbWUnLCB7XG4gICAgdXJsOiAnLycsXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3L2J1eWVyL2hvbWUuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xuICB9KVxuXG4gIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgdXJsOiAnL2xvZ2luJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3ZpZXcvdXNlci9sb2dpbi5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuICB9KVxuICAuc3RhdGUoJ3JlZ2lzdGVyJywge1xuICAgIHVybDogJy9yZWdpc3RlcicsXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3L3VzZXIvcmVnaXN0ZXIuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCdcbiAgfSlcblxuICAuc3RhdGUoJ2FkZEhvbWUnLCB7XG4gICAgdXJsOiAnL2FkZEhvbWUnLFxuICAgIHRlbXBsYXRlVXJsOiAndmlldy9zZWxsZXIvYWRkaG9tZS5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRkSG9tZUN0cmwnXG4gICB9KVxuXG4gICAuc3RhdGUoJ2FkZEhvbWUuYWRkSG9tZTEnLCB7XG4gICAgIHVybDogJy9hZGRIb21lMScsXG4gICAgIHRlbXBsYXRlVXJsOiAndmlldy9zZWxsZXIvYWRkaG9tZTEuaHRtbCdcbiAgICAgIH0pXG5cbiAgLnN0YXRlKCdhZGRIb21lLmFkZEhvbWUyJywge1xuICAgIHVybDogJy9hZGRIb21lMicsXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3L3NlbGxlci9hZGRob21lMi5odG1sJ1xuICB9KVxuICAgICAgXG4gIC5zdGF0ZSgnYWRkSG9tZS5hZGRIb21lMycsIHtcbiAgICB1cmw6ICcvYWRkSG9tZTMnLFxuICAgIHRlbXBsYXRlVXJsOiAndmlldy9zZWxsZXIvYWRkaG9tZTMuaHRtbCdcbiAgfSk7XG5cbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAvL3JlbW92ZSAjIGZyb20gdXJsXG4gIC8vaGFkIHRvIGNvbW1lbnQgdGhpcyBvdXQgYmVjYXVzZSBpb25pYyBzZXJ2ZXIgZG9lcyBub3Qgc3VwcGx5IGh0bWw1bW9kZS4gV2UnbGwgbmVlZCB0byB1c2Ugb3VyIGN1c3RvbSBub2RlIHNlcnZlciB0byBkbyB0aGlzLlxuICAvLyRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKS5oYXNoUHJlZml4KCchJyk7XG5cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLnNlcnZpY2VzJywgW10pXG5cbi5mYWN0b3J5KCdmaXJlQmFzZURhdGEnLCBbXCIkZmlyZWJhc2VcIiwgZnVuY3Rpb24gKCRmaXJlYmFzZSwgJHJvb3RTY29wZSkge1xuICAvL2d1bHAtcHJlcHJvY2VzcyB0byBjaGFuZ2UgRklSRUJBU0UgdG8gcHJvZHVjdGlvbiBVUkwgc2VlIHJvb3QvZ3VscGZpbGUuanNcbiAgLy9EbyBub3QgcmVtb3ZlIHRoZSBjb21tZW50cyBiZWxvdy5cbiAgdmFyIGhvbWVJbmZvO1xuICB2YXIgdmFsdWF0aW9uRGF0YTtcbiAgdmFyIHJlZlVzZXJDb25maWc7XG4gIHZhciByZWZDb25maWcgPSAnaHR0cHM6Ly9maWVyeS1oZWF0LTE5NzYuZmlyZWJhc2Vpby5jb20nO1xuXG4gIC8qIEBpZiBOT0RFX0VOVj0ncHJvZHVjdGlvbicgKi9cbiAgaG9tZUluZm8gPSAnaHR0cHM6Ly9maWVyeS1oZWF0LTE5NzYuZmlyZWJhc2Vpby5jb20vdW5seXN0Lyc7XG4gIHZhbHVhdGlvbkRhdGEgPSAnaHR0cHM6Ly9maWVyeS1oZWF0LTE5NzYuZmlyZWJhc2Vpby5jb20vdmFsdWF0aW9ucy1wcm9kJztcbiAgcmVmVXNlckNvbmZpZyA9IFwiaHR0cHM6Ly9maWVyeS1oZWF0LTE5NzYuZmlyZWJhc2Vpby5jb20vdXNlci9cIjtcbiAgLyogQGVuZGlmICovXG5cbiAgLyogQGlmIE5PREVfRU5WPSdkZXZlbG9wbWVudCcgKi9cbiAgaG9tZUluZm8gPSAnaHR0cHM6Ly9maWVyeS1oZWF0LTE5NzYuZmlyZWJhc2Vpby5jb20vdW5seXN0LXRlc3QvJztcbiAgdmFsdWF0aW9uRGF0YSA9ICdodHRwczovL2ZpZXJ5LWhlYXQtMTk3Ni5maXJlYmFzZWlvLmNvbS92YWx1YXRpb25zJztcbiAgcmVmVXNlckNvbmZpZyA9IFwiaHR0cHM6Ly9maWVyeS1oZWF0LTE5NzYuZmlyZWJhc2Vpby5jb20vdXNlci10ZXN0L1wiO1xuICAvKiBAZW5kaWYgKi9cblxuICB2YXIgcmVmID0gbmV3IEZpcmViYXNlKHJlZkNvbmZpZyk7XG4gIHZhciByZWZIb21lcyA9IG5ldyBGaXJlYmFzZShob21lSW5mbyk7XG4gIHZhciByZWZWYWx1YXRpb24gPSBuZXcgRmlyZWJhc2UodmFsdWF0aW9uRGF0YSk7XG4gIHZhciByZWZVc2VyID0gbmV3IEZpcmViYXNlKHJlZlVzZXJDb25maWcpO1xuXG4gIHJldHVybiB7XG4gICAgcmVmOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVmO1xuICAgIH0sXG4gICAgcmVmVmFsdWF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVmVmFsdWF0aW9uO1xuICAgIH0sXG4gICAgcmVmSG9tZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZWZIb21lcztcbiAgICB9LFxuICAgIHJlZlVzZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVmVXNlcjtcbiAgICB9LFxuICAgIHNhdmVWYWx1YXRpb246IGZ1bmN0aW9uIHNhdmVWYWx1YXRpb24odmFsdWF0aW9uLCBhdXRoRGF0YSwgcHJvcGVydHkpIHtcblxuICAgICAgaWYgKHJlZlVzZXIgPT0gbnVsbCB8fCBhdXRoRGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGF1dGhEYXRhLnJlcHV0YXRpb24gPT0gbnVsbCkge1xuICAgICAgICBhdXRoRGF0YS5yZXB1dGF0aW9uID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIGFjY3VyYWN5ID0gMTAwIC0gTWF0aC5hYnMoKHByb3BlcnR5LmNyb3dkdmFsdWUgLSB2YWx1YXRpb24pIC8gcHJvcGVydHkuY3Jvd2R2YWx1ZSkgKiAxMDA7XG5cbiAgICAgIGlmIChhY2N1cmFjeSA8IDApIHtcbiAgICAgICAgYWNjdXJhY3kgPSAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWF0aW9uID0ge1xuICAgICAgICBcImNyZWF0ZWRcIjogRmlyZWJhc2UuU2VydmVyVmFsdWUuVElNRVNUQU1QLFxuICAgICAgICBcImhvbWVJRFwiOiBwcm9wZXJ0eS4kaWQsXG4gICAgICAgIFwiaG9tZVZhbHVlXCI6IHByb3BlcnR5LmNyb3dkdmFsdWUsXG4gICAgICAgIFwiaG9tZVJlcHV0YXRpb25cIjogcHJvcGVydHkudG90YWxSZXB1dGF0aW9uLFxuICAgICAgICBcInVzZXJJRFwiOiBhdXRoRGF0YS51aWQsXG4gICAgICAgIFwidXNlclN1Ym1pdHRlZFZhbHVlXCI6IHBhcnNlSW50KHZhbHVhdGlvbiksXG4gICAgICAgIFwidXNlclJlcHV0YXRpb25cIjogYXV0aERhdGEucmVwdXRhdGlvbixcbiAgICAgICAgXCJhY2N1cmFjeVwiOiBhY2N1cmFjeVxuICAgICAgfTtcbiAgICAgIGNvbnNvbGUubG9nKGFjY3VyYWN5KTtcblxuICAgICAgdmFyIG5ld3JlcHVhdGlvblRvdGFsID0gcHJvcGVydHkudG90YWxSZXB1dGF0aW9uICsgYWNjdXJhY3k7XG4gICAgICAvL0VhY2ggdmFsdWF0aW9uIGNhbiBhc3NpZ24gYSBzY29yZSBmcm9tIDAtMTAuIFVzZSA3IGFzIHRoZSBiYXNlLCBzbyB0aGUgbWF4aW11bSBzY29yZSBvZiBhIHZhbHVhdGlvbiBpcyAwLTMuXG4gICAgICAvLyBsb2cgYmFzZSAxLjEgc2VlbXMgbGlrZSBhIGdvb2QgcGxhY2UgdG8gc3RhcnRcbi8vICAgICAgdmFyIHVzZXJSZXB1dGF0aW9uO1xuLy8gICAgICB2YXIgYWRqdXN0ZWRTY29yZTtcbi8vICAgICAgaWYgKGFjY3VyYWN5IC0gNzAgPD0gMCkge1xuLy8gICAgICAgIGFkanVzdGVkU2NvcmUgPSAwO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIGFkanVzdGVkU2NvcmUgPSAoYWNjdXJhY3kgLSA3MCkgLyAxMDtcbi8vICAgICAgICBjb25zb2xlLmxvZyhcImFkanVzdGVkIHNjb3JlOiBcIiArIGFkanVzdGVkU2NvcmUpO1xuLy8gICAgICAgIHVzZXJSZXB1dGF0aW9uID0gTWF0aC5sb2coYWRqdXN0ZWRTY29yZSArIGF1dGhEYXRhLnJlcHV0YXRpb24pIC8gTWF0aC5sb2coMS4xKTtcbi8vICAgICAgICAvL2lmIHRvdGFsIHJlcHV0YXRpb24gaXMgbGVzcyB0aGFuIDEsIGl0IHdpbGwgYmUgbmVnYXRpdmVcbi8vICAgICAgICBpZiAodXNlclJlcHV0YXRpb24gPT0gbnVsbCB8fCB1c2VyUmVwdXRhdGlvbiA8IDApIHtcbi8vICAgICAgICAgIHVzZXJSZXB1dGF0aW9uID0gMDtcbi8vICAgICAgICB9XG4vLyAgICAgIH1cbiAgICAgICAgXG4gICAgICAvL3BhcmFtYXRlcnMgdXNlZCB0byB1cGRhdGUgcmVwdXRhdGlvblxuICAgICAgdmFyIGJhc2UgPSAxLjEsXG4gICAgICAgICAgc2NhbGUgPSAxLjIsXG4gICAgICAgICAgcGFzc0FjY3VyYWN5ID0gNzAsXG4gICAgICAgICAgbWF4UmVwdXRhdGlvbiA9IDEwMDtcbiAgICAgIC8vIGFkanVzdHN0ZWQgc2NvcmUgYmV0d2VlbiAtMzAgYW5kIDMwXG4gICAgICB2YXIgYWRqdXN0ZWRTY29yZSA9IGFjY3VyYWN5IC0gcGFzc0FjY3VyYWN5O1xuICAgICAgaWYgKGFkanVzdGVkU2NvcmUgPCBwYXNzQWNjdXJhY3kgLSAxMDApIHtcbiAgICAgICAgICBhZGp1c3RlZFNjb3JlID0gcGFzc0FjY3VyYWN5IC0gMTAwO1xuICAgICAgfVxuICAgICAgLy8gYWRkIG5ldyBzY29yZSB0byBwcmV2aW91cyB0b3RhbCBcbiAgICAgIHZhciB1c2VyU2NvcmUgPSAoYXV0aERhdGEucmVwdXRhdGlvbikgPyBNYXRoLnBvdyhiYXNlLCBhdXRoRGF0YS5yZXB1dGF0aW9uL3NjYWxlKSArIGFkanVzdGVkU2NvcmUgOiBhZGp1c3RlZFNjb3JlO1xuICAgICAgaWYgKHVzZXJTY29yZSA8IGJhc2UpIHtcbiAgICAgICAgIHVzZXJTY29yZSA9IGJhc2U7XG4gICAgICB9XG4gICAgICAvLyByZWNvbXB1dGUgcmVwdXRhdGlvbiB3aXRoIGxvZ1xuICAgICAgdmFyIHVzZXJSZXB1dGF0aW9uID0gTWF0aC5sb2codXNlclNjb3JlKSAvIE1hdGgubG9nKGJhc2UpICogc2NhbGU7XG4gICAgICBpZiAodXNlclJlcHV0YXRpb24gPiBtYXhSZXB1dGF0aW9uKSB7XG4gICAgICAgICAgdXNlclJlcHV0YXRpb24gPSBtYXhSZXB1dGF0aW9uO1xuICAgICAgfVxuICAgICAgICBcbiAgICAgIGNvbnNvbGUubG9nKFwib2xkIHJlcHV0YXRpb246IFwiICsgYXV0aERhdGEucmVwdXRhdGlvbik7XG4gICAgICBjb25zb2xlLmxvZyhcInVzZXIgbmV3IHJlcHV0YXRpb246IFwiICsgdXNlclJlcHV0YXRpb24pO1xuXG4gICAgICByZWZWYWx1YXRpb24ucHVzaCh2YWx1YXRpb24pO1xuICAgICAgcmVmVXNlci5jaGlsZChhdXRoRGF0YS51aWQgKyAnL3ZhbHVhdGlvbnMnKS5wdXNoKHZhbHVhdGlvbik7XG4gICAgICByZWZVc2VyLmNoaWxkKGF1dGhEYXRhLnVpZCArICcvcmVwdXRhdGlvbicpLnNldCh1c2VyUmVwdXRhdGlvbik7XG4gICAgICByZWZIb21lcy5jaGlsZChwcm9wZXJ0eS4kaWQgKyAnL3ZhbHVhdGlvbnMnKS5wdXNoKHZhbHVhdGlvbik7XG4gICAgICByZWZIb21lcy5jaGlsZChwcm9wZXJ0eS4kaWQgKyAnL3RvdGFsUmVwdXRhdGlvbicpLnNldChuZXdyZXB1YXRpb25Ub3RhbCk7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH07XG59XSlcblxuLmZhY3RvcnkoJ3V0aWxpdHknLCBbZnVuY3Rpb24gKCRzY29wZSkge1xuICByZXR1cm4ge1xuICAgIHNodWZmbGU6IGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcblxuICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9LFxuICAgIGRlZmF1bHRDb25kb1ZhbHVlOiBmdW5jdGlvbiBjYWxjdWxhdGVEZWZhdWx0VmFsdWUoc2l6ZSkge1xuICAgICAgcmV0dXJuIHNpemUgKiA1MDA7XG4gICAgfSxcbiAgICBtYXhDb25kb1ZhbHVlOiBmdW5jdGlvbiBjYWxjdWxhdGVEZWZhdWx0VmFsdWUoc2l6ZSkge1xuICAgICAgLy92YXIgcmFuZG9tU2NhbGUgPSB3aW5kb3cuTWF0aC5mbG9vcigod2luZG93Lk1hdGgucmFuZG9tKCkgKiAtMC4yKSArIDAuMik7XG4gICAgICBpZiAoc2l6ZSAqIDEwMDAgPiAxMDAwMDAwKSB7XG4gICAgICAgIHJldHVybiBzaXplICogMTAwMDtcbiAgICAgIH1cbiAgICAgIC8vbWluaW51bSB2YWx1ZSBvZiAxIG1pbFxuICAgICAgcmV0dXJuIDEwMDAwMDA7XG4gICAgfVxuICB9XG59XSlcblxuLmZhY3RvcnkoJ2dlb2NvZGluZycsIFtmdW5jdGlvbiAoJHNjb3BlKXtcbiAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcbiAgICAvL2hhcmQgY29kZWQgZm9yIG5vd1xuICAgIHZhciBjaXR5ID0gJ1Rvcm9udG8nO1xuICAgIC8vIGdlb2NvZGluZyBBUEkgcmVxdWVzdFxuICAgIHZhciBnZXRSZXN1bHQgPSBmdW5jdGlvbihwcm9jZXNzUmVzdWx0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzICsgJywgJyArIGNpdHk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWRkcmVzczogJyArIGFkZHJlc3MpO1xuICAgICAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSggeyAnYWRkcmVzcyc6IGFkZHJlc3N9LCBmdW5jdGlvbihyZXN1bHRzLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcHJvY2Vzc1Jlc3VsdChyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBwYXJzZVJlc3VsdCA9IGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgdmFyIGNvb3JkaW5hdGVzID0gcmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbjtcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSByZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50cztcbiAgICAgICAgdmFyIHBvc3RhbF9jb2RlLCBuZWlnaGJvcmhvb2Q7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcG9uZW50cy5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgICAgIGlmKGNvbXBvbmVudHNbaV0udHlwZXMuaW5kZXhPZignbmVpZ2hib3Job29kJykgPj0gMCkge1xuICAgICAgICAgICAgICAgIG5laWdoYm9yaG9vZCA9IGNvbXBvbmVudHNbaV0ubG9uZ19uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoY29tcG9uZW50c1tpXS50eXBlcy5pbmRleE9mKCdwb3N0YWxfY29kZScpID49IDApIHtcbiAgICAgICAgICAgICAgICBwb3N0YWxfY29kZSA9IGNvbXBvbmVudHNbaV0ubG9uZ19uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYXQ6IGNvb3JkaW5hdGVzLmxhdCgpLFxuICAgICAgICAgICAgbG5nOiBjb29yZGluYXRlcy5sbmcoKSxcbiAgICAgICAgICAgIHBvc3RhbF9jb2RlOiBwb3N0YWxfY29kZSxcbiAgICAgICAgICAgIG5laWdoYm9yaG9vZDogbmVpZ2hib3Job29kLFxuICAgICAgICAgICAgZnVsbF9hZGRyZXNzOiByZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIC8vZ2V0RGF0YSB3aWxsIGZpbmQgbGF0LCBsbmcsIHBvc3RhbGNvZGUsIG5laWdoYm9ob29kIG9mIGEgZ2l2ZW4gYWRkcmVzc1xuICAgICAgICBnZXREYXRhOiBnZXRSZXN1bHQocGFyc2VSZXN1bHQpXG4gICAgfVxufV0pXG5cbi5mYWN0b3J5KCdob21lU2NoZW1hJywgW2Z1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgIHZhciBob21lU2NoZW1hID0ge1xuICAgICAgICBob21lVHlwZXMgOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJDb25kb21pbml1bVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiY29uZG9taW5pdW1cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJTZW1pLWRhdGFjaGVkIEhvdXNlXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJzZW1pSG91c2VcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJEZXRhY2hlZCBIb3VzZVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiZGV0YWNoZWRIb3VzZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlRvd25ob3VzZVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwidG93bkhvdXNlXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGJ1aWxkaW5nVHlwZXMgOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJIaWdoLXJpc2VcIixcbiAgICAgICAgICAgIHZhbHVlOiBcImhpZ2hSaXNlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiTWlkLXJpc2VcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIm1pZFJpc2VcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJMb3ctcmlzZVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwibG93UmlzZVwiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBiZWRSb29tczogWzAsMSwyLDMsNF0sXG4gICAgICAgIGJhdGhSb29tczogWzAsMSwyLDMsNF0sXG4gICAgICAgIGFkZGl0aW9uYWxTcGFjZTogWydEZW4nLCdzdHVkeScsICdTdW5yb29tJywgJ1N0b3JhZ2UgbG9ja2VyJ10sXG4gICAgICAgIHBhcmtpbmdUeXBlOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJuL2FcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIm5hXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiVW5kZXJncm91bmQgR2FyYWdlXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJ1bmRlckdyb3VuZEdyZ1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIkFib3ZlIEdyb3VuZCBHYXJhZ2VcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIkFib3ZlR3JvdW5kR3JnXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiRHJpdmV3YXlcIixcbiAgICAgICAgICAgIHZhbHVlOiBcImRyaXZld2F5XCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHBhcmtpbmdTcGFjZTogWzAsMSwyLDMsNF0sXG4gICAgICAgIG91dGRvb3JTcGFjZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiQmFsY29ueVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYmFsY29ueVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlRlcnJhY2VcIixcbiAgICAgICAgICAgIHZhbHVlOiBcInRlcnJhY2VcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJKdWxpZXQgYmFsY29ueVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwianVsaWV0QmFsY29ueVwiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBvcmllbnRhdGlvbjogW1wiTm9ydGhcIiwgXCJFYXN0XCIsIFwiU291dGhcIixcIldlc3RcIl0sXG4gICAgICAgIGFtZW5pdHk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlBvb2xcIixcbiAgICAgICAgICAgIHZhbHVlOiBcInBvb2xcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJHeW1cIixcbiAgICAgICAgICAgIHZhbHVlOiBcImd5bVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlNhdW5hXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJzYXVuYVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlN0ZWFtXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJzdGVhbVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIlNwYVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwic3BhXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiUm9vZnRvcFwiLFxuICAgICAgICAgICAgdmFsdWU6IFwicm9vZnRvcFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcIkJCUVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiYmJxXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiUGV0IFdhc2hcIixcbiAgICAgICAgICAgIHZhbHVlOiBcInBldFdhc2hcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJDb25jaWVyZ2UoMjQgaG91cilcIixcbiAgICAgICAgICAgIHZhbHVlOiBcImNvbmNpZXJnZUZ1bGxUaW1lXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiQ29uY2llcmdlKFBhcnQtdGltZSlcIixcbiAgICAgICAgICAgIHZhbHVlOiBcImNvbmNpZXJnZVBhcnRUaW1lXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IFwiUGFydHkgUm9vbVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwicGFydHlSb29tXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGxhdDowLFxuICAgICAgICBsbmc6MFxuICAgICAgfTtcbiAgICAgIHJldHVybiBob21lU2NoZW1hO1xufV0pO1xuIiwic3RhcnRlckNvbnRyb2xsZXJzXG5cbi5jb250cm9sbGVyKCdIZWFkZXJDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgZmlyZUJhc2VEYXRhLCAkaW9uaWNQb3BvdmVyLCAkaW9uaWNIaXN0b3J5LCAkc3RhdGUpIHtcbiAgLy9hdXRoZW50aWNhdGlvblxuICAkcm9vdFNjb3BlLmF1dGhEYXRhID0gZmlyZUJhc2VEYXRhLnJlZigpLmdldEF1dGgoKTtcbiAgJHJvb3RTY29wZS5nZXRVc2VyRGlzcGxheU5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCRyb290U2NvcGUuYXV0aERhdGEgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBlbHNlIGlmICgkcm9vdFNjb3BlLmF1dGhEYXRhLnByb3ZpZGVyID09PSAnZ29vZ2xlJykge1xuICAgICAgcmV0dXJuICRyb290U2NvcGUuYXV0aERhdGEuZ29vZ2xlLmRpc3BsYXlOYW1lLnNwbGl0KCcgJylbMF07XG4gICAgfVxuICAgIGVsc2UgaWYgKCRyb290U2NvcGUuYXV0aERhdGEucHJvdmlkZXIgPT09ICdmYWNlYm9vaycpIHtcbiAgICAgIHJldHVybiAkcm9vdFNjb3BlLnVzZXJEaXNwbGF5TmFtZSA9ICRyb290U2NvcGUuYXV0aERhdGEuZmFjZWJvb2suZGlzcGxheU5hbWUuc3BsaXQoJyAnKVswXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJHJvb3RTY29wZS5hdXRoRGF0YS5wcm92aWRlciA9PT0gJ3R3aXR0ZXInKSB7XG4gICAgICByZXR1cm4gJHJvb3RTY29wZS5hdXRoRGF0YS50d2l0dGVyLmRpc3BsYXlOYW1lLnNwbGl0KCcgJylbMF07XG4gICAgfVxuICAgIGVsc2UgaWYgKCRyb290U2NvcGUuYXV0aERhdGEucHJvdmlkZXIgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgIGlmICgkcm9vdFNjb3BlLmF1dGhEYXRhLnVzZXIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gJHJvb3RTY29wZS5hdXRoRGF0YS51c2VyLmZpcnN0bmFtZTtcbiAgICB9XG4gIH07XG5cbiAgLy9jb25zb2xlLmxvZygkcm9vdFNjb3BlLmF1dGhEYXRhKTtcbiAgJGlvbmljUG9wb3Zlci5mcm9tVGVtcGxhdGVVcmwoJ3ZpZXcvdXNlci9wb3BvdmVyLmh0bWwnLCB7XG4gICAgc2NvcGU6ICRzY29wZVxuICB9KS50aGVuKGZ1bmN0aW9uIChwb3BvdmVyKSB7XG4gICAgJHNjb3BlLnBvcG92ZXIgPSBwb3BvdmVyO1xuICB9KTtcbiAgLyogTE9HT1VUIEJVVFRPTiAqL1xuICAkcm9vdFNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcbiAgICBmaXJlQmFzZURhdGEucmVmKCkudW5hdXRoKCk7XG4gICAgJHJvb3RTY29wZS5jaGVja1Nlc3Npb24oKTtcbiAgICAkcm9vdFNjb3BlLm5vdGlmeShcIkxvZ2dlZCBvdXQgc3VjY2Vzc2Z1bGx5IVwiKTtcbiAgICAkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG4gIH07XG5cbiAgJHJvb3RTY29wZS5jaGVja1Nlc3Npb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHJvb3RTY29wZS5hdXRoRGF0YSA9IGZpcmVCYXNlRGF0YS5yZWYoKS5nZXRBdXRoKCk7XG4gICAgJHJvb3RTY29wZS5oaWRlKCk7XG4gICAgJHN0YXRlLmdvKCdob21lJyk7XG5cbiAgfTtcbn0pO1xuXG4iLCJzdGFydGVyQ29udHJvbGxlcnNcblxuLmNvbnRyb2xsZXIoJ01vZGFsQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRtZERpYWxvZywgdmFsdWF0aW9uKSB7XG4gICRzY29wZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICRtZERpYWxvZy5oaWRlKCk7XG4gICAgJHNjb3BlLmNsaWNrTmV4dCgpO1xuICB9O1xuXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xuICAgICRzY29wZS5jbGlja05leHQoKTtcbiAgfTtcbiAgJHNjb3BlLnZhbHVhdGlvbiA9IHZhbHVhdGlvbjtcblxufSlcblxuLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgZmlyZUJhc2VEYXRhLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlLCB1dGlsaXR5LCBnZW9jb2RpbmcsICRmaXJlYmFzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24sICR0aW1lb3V0LCAkbWREaWFsb2cpIHtcblxuICAvL2JpbmQgbW9kZWwgdG8gc2NvZXA7IHNldCB2YWx1YXRpb25cbiAgJHNjb3BlLmhvbWUgPSB7fTtcbiAgJHNjb3BlLmhvbWUudmFsdWF0aW9uID0gMTAwMDAwO1xuICAkc2NvcGUuc2NvcmUgPSAwO1xuICAkc2NvcGUuTWF0aCA9IHdpbmRvdy5NYXRoO1xuICB2YXIgYWRtaW4gPSAkbG9jYXRpb24uc2VhcmNoKCk7XG4gIC8vVXNlZCB0byBpbiBsaW5lIGVkaXQgdGhlIHBpY3R1cmVzXG4gICRzY29wZS5BZG1pbk1vZGUgPSBhZG1pbi5hZG1pbjtcblxuICAkc2NvcGUubWFwID0ge307XG4gICRzY29wZS5kZWZhdWx0em9vbSA9IDE1O1xuICAvL3Rlc3QgbW9kZVxuICAkc2NvcGUuc3RvcFJlY29yZGluZyA9IGZhbHNlO1xuXG4gIHZhciBob21lc0RCID0gZmlyZUJhc2VEYXRhLnJlZkhvbWVzKCk7XG4gIHZhciBob21lc1JlZiA9ICRmaXJlYmFzZShmaXJlQmFzZURhdGEucmVmSG9tZXMoKSkuJGFzQXJyYXkoKTtcbiAgdmFyIHZhbHVhdGlvbkRCID0gZmlyZUJhc2VEYXRhLnJlZlZhbHVhdGlvbigpO1xuICAvL2luaXQgZmlyZWJhc2VcbiAgaG9tZXNSZWYuJGxvYWRlZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGhvdXNlcyA9IHV0aWxpdHkuc2h1ZmZsZShob21lc1JlZik7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgJHNjb3BlLnByb3BlcnR5ID0gaG91c2VzW2ldO1xuICAgICRzY29wZS5saWtlcyA9IDIwO1xuICAgICRzY29wZS5idWlsZFlyID0gMjAxNCAtICRzY29wZS5wcm9wZXJ0eS5idWlsZFlyO1xuICAgICRzY29wZS5oaWRlRGV0YWlsID0gdHJ1ZTtcbiAgICAkc2NvcGUuY3Jvd2R2YWx1ZSA9ICRzY29wZS5wcm9wZXJ0eS5jcm93ZHZhbHVlO1xuXG4gICAgJHNjb3BlLm1hcCA9IHtcbiAgICAgIGxhdDogJHNjb3BlLnByb3BlcnR5LmxhdCxcbiAgICAgIGxuZzogJHNjb3BlLnByb3BlcnR5LmxuZyxcbiAgICAgIHpvb206ICRzY29wZS5kZWZhdWx0em9vbVxuICAgIH07XG4gICAgJHNjb3BlLm1hcmtlcnMgPSB7XG4gICAgICBvc2xvTWFya2VyOiB7XG4gICAgICAgIGxhdDogJHNjb3BlLnByb3BlcnR5LmxhdCxcbiAgICAgICAgbG5nOiAkc2NvcGUucHJvcGVydHkubG5nLFxuICAgICAgICBmb2N1czogdHJ1ZSxcbiAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvL3ByaWNlIHNsaWRlclxuICAgICRzY29wZS5ob21lLm1pblZhbHVhdGlvbiA9IDEwMDAwMDtcbiAgICAkc2NvcGUuaG9tZS5tYXhWYWx1YXRpb24gPSB1dGlsaXR5Lm1heENvbmRvVmFsdWUoaG91c2VzW2ldLnNpemUpO1xuXG4gICAgLy8gbmVlZCB0byB1c2UgdGhpcyBtZXRob2QgYW5kIG5nLWluaXQgdG8gYmluZCB0aGUgaW5pdGlhbCB2YWx1ZS4gVGhlcmUncyBhIGJ1ZyBpbiB0aGUgcmFuZ2Ugc2xpZGVyIGluIGlvbmljLlxuICAgICRzY29wZS5nZXREZWZhdWx0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvL25lZWQgdGhlIHRpbWVvdXQgdG8gbWFrZSBpdCB3b3JrXG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5ob21lLnZhbHVhdGlvbiA9IHV0aWxpdHkuZGVmYXVsdENvbmRvVmFsdWUoaG91c2VzW2ldLnNpemUpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9O1xuICAgICRzY29wZS5nZXREZWZhdWx0VmFsdWUoKTtcblxuICAgICRzY29wZS4kYnJvYWRjYXN0KCd1cGRhdGVNYXAnLCAkc2NvcGUubWFwKTtcbiAgICAvL25lZWQgYSB0aW1lb3V0IGZvciBzbGlkZWJveCB0byBsb2FkIHNvIHRoYXQgdGFicyBkaXNwbGF5IGNvcnJlY3RseVxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUudXBkYXRlKCk7XG4gICAgICAkc2NvcGUuJGJyb2FkY2FzdCgndXBkYXRlVGFicycpO1xuICAgIH0sIDEwMCk7XG5cbiAgICAkc2NvcGUuc2F2ZUNhcHRpb24gPSBmdW5jdGlvbiAoZGF0YSwgaW1nSW5kZXgpIHtcbiAgICAgIHZhciBob3VzZSA9IGhvbWVzREIuY2hpbGQoaG91c2VzW2ldLiRpZCk7XG4gICAgICB2YXIgY2FwdGlvblJlZiA9ICdpbWcvJyArIGltZ0luZGV4ICsgJy9jYXB0aW9uJztcbiAgICAgIGhvdXNlLmNoaWxkKGNhcHRpb25SZWYpLnNldChkYXRhKTtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LCAxMDApXG4gICAgfTtcblxuICAgIGlmICgkcm9vdFNjb3BlLmF1dGhEYXRhICE9IG51bGwpIHtcbiAgICAgIHZhciByZWZVc2VyUmVwID0gZmlyZUJhc2VEYXRhLnJlZlVzZXJzKCkuY2hpbGQoJHJvb3RTY29wZS5hdXRoRGF0YS51aWQgKyAnL3JlcHV0YXRpb24nKTtcbiAgICAgIHJlZlVzZXJSZXAub24oXCJ2YWx1ZVwiLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGVkIHZhbHVlIGhlcmU6XCIgKyBzbmFwc2hvdC52YWwoKSk7XG4gICAgICAgIGlmICgkcm9vdFNjb3BlLmF1dGhEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhEYXRhLnJlcHV0YXRpb24gPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yT2JqZWN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHJlYWQgZmFpbGVkOiBcIiArIGVycm9yT2JqZWN0LmNvZGUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS52YWx1YXRpb24gPSB7fTtcblxuICAgICRzY29wZS5zdWJtaXRTY29yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS52YWx1YXRpb24uY3Jvd2R2YWx1ZSA9ICRzY29wZS5wcm9wZXJ0eS5jcm93ZHZhbHVlO1xuICAgICAgJHNjb3BlLnZhbHVhdGlvbi5zY29yZSA9IDEwIC0gTWF0aC5hYnMoKCRzY29wZS5jcm93ZHZhbHVlIC0gJHNjb3BlLmhvbWUudmFsdWF0aW9uKSAqIDEuNSAvICRzY29wZS5jcm93ZHZhbHVlICogMTApO1xuICAgICAgaWYgKCRzY29wZS52YWx1YXRpb24uc2NvcmUgPCAwKSB7XG4gICAgICAgICRzY29wZS52YWx1YXRpb24uc2NvcmUgPSAwO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ3lvdXIgc2NvcmU6JyArICRzY29wZS52YWx1YXRpb24uc2NvcmUpO1xuICAgICAgaWYgKCEkc2NvcGUuc3RvcFJlY29yZGluZykge1xuICAgICAgICBmaXJlQmFzZURhdGEuc2F2ZVZhbHVhdGlvbigkc2NvcGUuaG9tZS52YWx1YXRpb24sICRzY29wZS5hdXRoRGF0YSwgJHNjb3BlLnByb3BlcnR5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9tb2RhbCBwb3B1cFxuICAgICRzY29wZS5wb3N0VmFsdWF0aW9uUG9wdXAgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICRtZERpYWxvZy5zaG93KHtcbiAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ3RybCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlldy9idXllci9tb2RhbC5odG1sJyxcbiAgICAgICAgbG9jYWxzOiB7XG4gICAgICAgICAgdmFsdWF0aW9uOiAkc2NvcGUudmFsdWF0aW9uXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jbGlja05leHQoKTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmNsaWNrTmV4dCgpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jbGlja05leHQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUuc2xpZGUoMCk7XG4gICAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xuXG4gICAgICB2YXIgbGVuZ3RoID0gaG91c2VzLmxlbmd0aDtcbiAgICAgICRzY29wZS5oaWRlRGV0YWlsID0gdHJ1ZTtcbiAgICAgIGlmIChpIDwgbGVuZ3RoIC0gMSkge1xuICAgICAgICBpKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpID0gMDtcbiAgICAgIH1cbiAgICAgICRzY29wZS5wcm9wZXJ0eSA9IGhvdXNlc1tpXTtcbiAgICAgICRzY29wZS5saWtlcyA9IDIwO1xuICAgICAgJHNjb3BlLmJ1aWxkWXIgPSAyMDE0IC0gJHNjb3BlLnByb3BlcnR5LmJ1aWxkWXI7XG4gICAgICAkc2NvcGUuaGlkZURldGFpbCA9IHRydWU7XG4gICAgICAvL3ByZXZlbnQgdGhlIG5leHQgc2NvcmUgdG8gYmUgc2hvd25cbiAgICAgIC8vJHNjb3BlLmNyb3dkdmFsdWUgPSAkc2NvcGUucHJvcGVydHkuY3Jvd2R2YWx1ZTtcbiAgICAgICRzY29wZS5tYXAubGF0ID0gJHNjb3BlLnByb3BlcnR5LmxhdDtcbiAgICAgICRzY29wZS5tYXAubG5nID0gJHNjb3BlLnByb3BlcnR5LmxuZztcbiAgICAgICRzY29wZS5ob21lLm1heFZhbHVhdGlvbiA9IHV0aWxpdHkubWF4Q29uZG9WYWx1ZSgkc2NvcGUucHJvcGVydHkuc2l6ZSk7XG4gICAgICAkc2NvcGUuaG9tZS52YWx1YXRpb24gPSB1dGlsaXR5LmRlZmF1bHRDb25kb1ZhbHVlKCRzY29wZS5wcm9wZXJ0eS5zaXplKTtcbiAgICAgICRzY29wZS4kYnJvYWRjYXN0KCd1cGRhdGVtYXAnLCAkc2NvcGUubWFwKTtcbiAgICAgICRzY29wZS4kYnJvYWRjYXN0KCd1cGRhdGVUYWJzJywgJHNjb3BlLm1hcCk7XG4gICAgfTtcblxuICB9KTtcbn0pXG5cbi5jb250cm9sbGVyKCdBZGRIb21lQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZScsICckZmlyZWJhc2UnLCAnZmlyZUJhc2VEYXRhJywgJ2hvbWVTY2hlbWEnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHN0YXRlLCAkZmlyZWJhc2UsIGZpcmVCYXNlRGF0YSwgaG9tZVNjaGVtYSkge1xuXG4gIGNvbnNvbGUubG9nKFwiQWRkSG9tZUN0cmxcIik7XG4gICRzdGF0ZS5nbyhcImFkZEhvbWUuYWRkSG9tZTFcIik7XG4gIHZhciBob21lc0RCID0gZmlyZUJhc2VEYXRhLnJlZkhvbWVzKCk7XG4gIHZhciBob21lc1JlZiA9ICRmaXJlYmFzZShob21lc0RCKS4kYXNBcnJheSgpO1xuXG4gICRzY29wZS5ob21lU2NoZW1hID0gaG9tZVNjaGVtYTtcbiAgY29uc29sZS5sb2coaG9tZVNjaGVtYSk7XG4gICRzY29wZS5ob21lID0ge1xuICAgIGFkZHJlc3M6IFwiXCIsXG4gICAgc3VpdGVOdW1iZXI6IFwiXCIsXG4gICAgY2l0eTogXCJUb3JvbnRvXCIsXG4gICAgcHJvdmluY2U6IFwiT05cIixcbiAgICBwb3N0YWxDb2RlOiBcIlwiLFxuICAgIG5laWdoYm9yaG9vZDogXCJcIixcbiAgICBoaWRlQWRkcmVzczogZmFsc2UsXG4gICAgb3duZXJDZXJ0aWZ5OiBmYWxzZSxcbiAgICBob21lVHlwZTogJHNjb3BlLmhvbWVTY2hlbWEuaG9tZVR5cGVzWzBdLnZhbHVlLFxuICAgIGJ1aWxkaW5nVHlwZTogJHNjb3BlLmhvbWVTY2hlbWEuYnVpbGRpbmdUeXBlc1swXS52YWx1ZSxcbiAgICBidWlsZGluZ05hbWU6IFwiXCIsXG4gICAgc2l6ZTogJycsXG4gICAgYmVkcm9vbU51bTogJHNjb3BlLmhvbWVTY2hlbWEuYmVkUm9vbXNbMF0sXG4gICAgYmF0aHJvb21OdW06ICRzY29wZS5ob21lU2NoZW1hLmJhdGhSb29tc1swXSxcbiAgICBhZGRpdGlvbmFsU3BhY2U6IFtdLFxuICAgIHBhcmtpbmdUeXBlOiAkc2NvcGUuaG9tZVNjaGVtYS5wYXJraW5nVHlwZVswXS52YWx1ZSxcbiAgICBwYXJraW5nU3BhY2U6IDAsXG4gICAgb3V0ZG9vclNwYWNlOiBbXSxcbiAgICBvcmllbnRhdGlvbjogW10sXG4gICAgYW1lbml0eTogW10sXG4gICAgeWVhckJ1aWx0OiAnJyxcbiAgICBtYWludGVuYW5jZUZlZTogJycsXG4gICAgaG91c2VJZDogLTEsXG4gICAgaW1nOiBbXVxuICB9O1xuXG4gICRzY29wZS51cGxvYWRGaWxlcyA9IFtdO1xuXG4gICRzY29wZS51cGxvYWRGaWxlID0gZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgY29uc29sZS5sb2coZmlsZXNbMF0pO1xuICAgIHZhciBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZkLmFwcGVuZChcImZpbGVcIiwgZmlsZXNbMF0pO1xuICAgICRzY29wZS51cGxvYWRGaWxlcy5wdXNoKGZkKTtcbiAgfTtcblxuICAgICAgICAvL3B1dCB1cGxvYWQgZnVuY3Rpb24gYW5kIGluc2lkZSBwcm9taXNlXG4gIGhvbWVzUmVmLiRsb2FkZWQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZCBob21lcmVmIC4uLi5cIilcbiAgICAgICAgICB2YXIgbGVuZ3RoID0gaG9tZXNSZWYubGVuZ3RoO1xuICAgICAgICAgIHZhciBpZCA9IGhvbWVzUmVmW2xlbmd0aC0xXS5ob3VzZUlkO1xuICAgICAgICAgIGlmIChpZCA+PSBsZW5ndGgtMSApe1xuICAgICAgICAgICAgLy9zZXQgaG91c2VJRCBmb3IgbmV3IGhvbWVcbiAgICAgICAgICAgICRzY29wZS5ob21lLmhvdXNlSWQgID0gaWQgKyAxO1xuICAgICAgICAgICAgLy9wcmVwYXJlIGZvciBpbWFnZSB1cGxvYWRcbiAgICAgICAgICAgICRzY29wZS51cGxvYWRGaWxlID0gZnVuY3Rpb24oZmlsZXMsIG5hbWUpe1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlcyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaG91c2VJRDogXCIgKyAkc2NvcGUuaG9tZS5ob3VzZUlkKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZmlsZXNbMF0pO1xuICAgICAgICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgICAgZmQuYXBwZW5kKFwiZmlsZVwiLCBmaWxlc1swXSk7XG4gICAgICAgICAgICAgIGZkLmFwcGVuZChcImhvdXNlSWRcIiwgJHNjb3BlLmhvbWUuaG91c2VJZCk7XG4gICAgICAgICAgICAgIGZkLmFwcGVuZChcImltYWdlTnVtXCIsbmFtZSk7XG4gICAgICAgICAgICAgICRzY29wZS51cGxvYWRGaWxlcy5wdXNoKGZkKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS51cGxvYWRGaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBmaWxlID0gJHNjb3BlLnVwbG9hZEZpbGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByZXEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVybDonL3VwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6dHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiB1bmRlZmluZWR9LFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBhbmd1bGFyLmlkZW50aXR5XG4gICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAkaHR0cChyZXEpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgIGNhcHRpb246JycsXG4gICAgICAgICAgICAgICAgICAgICAgdXJsOiAnJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9LXCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBpbWdPYmoudXJsID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmhvbWUuaW1nLnB1c2ggKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FwdGlvblwiIDogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVybFwiIDogZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy9zdGFydCB0byBwdXNoLi4uLi5cbiAgICAgICAgICAgICAgICAgICAgLy9ob21lc0RCLmNoaWxkKCRzY29wZS5ob21lLmhvdXNlSWQpLnNldCgkc2NvcGUuaG9tZSlcbiAgICAgICAgICAgICAgICAgICAgaG9tZXNSZWYuJGFkZCgkc2NvcGUuaG9tZSkudGhlbihmdW5jdGlvbihyZWYpe1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmV0dXJuIGlzOiAgXCIgKyByZWYpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gTm8gRmlsZSBTZWxlY3RlZFxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ05vIEZpbGUgU2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IGhvdXNlIElEIGlzIG5vdCBjb3JyZWN0IVwiKVxuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG5cbiAgICAgICRzY29wZS50b2dnbGVTZWxlY3Rpb24gPSBmdW5jdGlvbihpdGVtLCBzZWxlY3Rpb25BcnIpIHtcbiAgICAgICAgdmFyIGlkeCA9IHNlbGVjdGlvbkFyci5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAvLyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcbiAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgc2VsZWN0aW9uQXJyLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlzIG5ld2x5IHNlbGVjdGVkXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNlbGVjdGlvbkFyci5wdXNoKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5nb1RvUGcyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImdvdG9wYWdlMlwiKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhZGRIb21lLmFkZEhvbWUyJyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvVG9QZzMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ290byBob20zXCIpO1xuICAgICAgICAkc3RhdGUuZ28oJ2FkZEhvbWUuYWRkSG9tZTMnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYWRkaG9tZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJhZGQgaG9tZVwiKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhZGRIb21lLmFkZEhvbWUxJyk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc3VibWl0SG9tZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB9O1xufV0pOyIsInN0YXJ0ZXJDb250cm9sbGVyc1xuXG4uY29udHJvbGxlcignTWFwQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgJHNjb3BlLmxheWVycyA9IHtcbiAgICBiYXNlbGF5ZXJzOiB7XG4gICAgICAvL0lmIHdlIHdhbnQgdG8gc3dpdGNoIHRvIGdvb2dsZSBtYXBzIG9yIGJvdGg6XG4gICAgICAvL2dvb2dsZVJvYWRtYXA6IHtcbiAgICAgIC8vICBuYW1lOiAnR29vZ2xlIFN0cmVldHMnLFxuICAgICAgLy8gIGxheWVyVHlwZTogJ1JPQURNQVAnLFxuICAgICAgLy8gIHR5cGU6ICdnb29nbGUnXG4gICAgICAvL30sXG4gICAgICBtYXBib3hfdGVycmFpbjoge1xuICAgICAgICBcIm5hbWVcIjogXCJNYXBib3ggVGVycmFpblwiLFxuICAgICAgICBcInVybFwiOiBcImh0dHA6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC97bWFwaWR9L3t6fS97eH0ve3l9LnBuZz9hY2Nlc3NfdG9rZW49cGsuZXlKMUlqb2laRzl1WjIxcGJtZHNhWGtpTENKaElqb2lRMnRuV1Y5QmF5SjkuSEVxMnRTeS1KdmlkMjFzUU5JVUJSUVwiLFxuICAgICAgICBcInR5cGVcIjogXCJ4eXpcIixcbiAgICAgICAgXCJsYXllck9wdGlvbnNcIjoge1xuICAgICAgICAgIFwiYXBpa2V5XCI6IFwicGsuZXlKMUlqb2laRzl1WjIxcGJtZHNhWGtpTENKaElqb2lRMnRuV1Y5QmF5SjkuSEVxMnRTeS1KdmlkMjFzUU5JVUJSUVwiLFxuICAgICAgICAgIFwibWFwaWRcIjogXCJkb25nbWluZ2xpeS5rZ2I0bTkwZlwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gICRzY29wZS5kZWZhdWx0cyA9IHtcbiAgICBzY3JvbGxXaGVlbFpvb206IGZhbHNlXG4gIH07XG5cbiAgJHNjb3BlLiRvbigndXBkYXRlbWFwJywgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XG5cbiAgICAkc2NvcGUubWFwID0ge1xuICAgICAgbGF0OiAkc2NvcGUuJHBhcmVudC5tYXAubGF0LFxuICAgICAgbG5nOiAkc2NvcGUuJHBhcmVudC5tYXAubG5nLFxuICAgICAgem9vbTogJHNjb3BlLiRwYXJlbnQuZGVmYXVsdHpvb21cbiAgICB9O1xuXG4gICAgJHNjb3BlLm1hcmtlcnMgPSB7XG4gICAgICBvc2xvTWFya2VyOiB7XG4gICAgICAgIGxhdDogJHNjb3BlLiRwYXJlbnQubWFwLmxhdCxcbiAgICAgICAgbG5nOiAkc2NvcGUuJHBhcmVudC5tYXAubG5nLFxuICAgICAgICBmb2N1czogdHJ1ZSxcbiAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSk7Iiwic3RhcnRlckNvbnRyb2xsZXJzXG5cbi5jb250cm9sbGVyKCdTbGlkZXJDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwkcm9vdFNjb3BlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlKSB7XG4gICRzY29wZS5hY3RpdmVTbGlkZSA9IDA7XG4gICRzY29wZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICRpb25pY1NsaWRlQm94RGVsZWdhdGUubmV4dCgpO1xuICB9O1xuICAkc2NvcGUucHJldmlvdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5wcmV2aW91cygpO1xuICB9O1xuXG4gICRpb25pY1NsaWRlQm94RGVsZWdhdGUudXBkYXRlKCk7XG5cbiAgdmFyIHVwZGF0ZVRhYnMgPWZ1bmN0aW9uICgpIHtcbiAgICBudW1TbGlkZXMgPSAkaW9uaWNTbGlkZUJveERlbGVnYXRlLmNvdW50KCk7XG4gICAgJHNjb3BlLmN1clBob3RvU2xpZGUgPSAkc2NvcGUuY3VySW5mb1NsaWRlID0gJyc7XG4gICAgaWYgKGlzUGhvdG9TbGlkZSgpKSB7XG4gICAgICB2YXIgY3VyU2xpZGUgPSAkc2NvcGUuYWN0aXZlU2xpZGUgKyAxO1xuICAgICAgJHNjb3BlLmN1clBob3RvU2xpZGUgPSBjdXJTbGlkZSArICcvJyArICRzY29wZS5wcm9wZXJ0eS5pbWcubGVuZ3RoO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0luZm9TbGlkZSgpKSB7XG4gICAgICB2YXIgY3VyU2xpZGUgPSAkc2NvcGUuYWN0aXZlU2xpZGUgLSAkc2NvcGUucHJvcGVydHkuaW1nLmxlbmd0aCArIDE7XG4gICAgICAkc2NvcGUuY3VySW5mb1NsaWRlID0gY3VyU2xpZGUgKyAnLycgKyAzO1xuICAgIH1cbiAgfTtcblxuICAvLyBDYWxsZWQgZWFjaCB0aW1lIHRoZSBzbGlkZSBjaGFuZ2VzXG4gICRzY29wZS5zbGlkZUhhc0NoYW5nZWQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnNsaWRlKGluZGV4KTtcbiAgICAkc2NvcGUuYWN0aXZlU2xpZGUgPSBpbmRleDtcbiAgICAkaW9uaWNTbGlkZUJveERlbGVnYXRlLnVwZGF0ZSgpO1xuICAgIHVwZGF0ZVRhYnMoKTtcbiAgfTtcblxuICAvL2ZvciB0YWJzIHNob3dpbmcgY29ycmVjdGx5XG4gIHZhciBudW1TbGlkZXMgPSAwO1xuICAkc2NvcGUuY3VyUGhvdG9TbGlkZSA9ICRzY29wZS5jdXJJbmZvU2xpZGUgPSAnJztcblxuXG4gIHZhciBpc1Bob3RvU2xpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRzY29wZS5hY3RpdmVTbGlkZSA8IG51bVNsaWRlcyAtIDMgLSAxO1xuICB9XG4gIHZhciBpc0luZm9TbGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJHNjb3BlLmFjdGl2ZVNsaWRlIDwgbnVtU2xpZGVzIC0gMVxuICAgICYmICRzY29wZS5hY3RpdmVTbGlkZSA+PSBudW1TbGlkZXMgLSAzIC0gMTtcbiAgfVxuXG59KTsiLCJzdGFydGVyQ29udHJvbGxlcnNcblxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSwgZmlyZUJhc2VEYXRhLCAkdGltZW91dCkge1xuXG4gICRzY29wZS5oaWRlQmFja0J1dHRvbiA9IHRydWU7XG5cbiAgJHJvb3RTY29wZS51c2VyID0ge307XG4gICRyb290U2NvcGUudXNlci51c2VybmFtZSA9ICRzY29wZS51c2VyLnVzZXJuYW1lO1xuICAkcm9vdFNjb3BlLnVzZXIucGFzc3dvcmQgPSAkc2NvcGUudXNlci5wYXNzd29yZDtcblxuICBmdW5jdGlvbiBvbkxvZ2luU3VjY2VzcyhhdXRoRGF0YSkge1xuICAgIHNhdmVVc2VyUHJvZmlsZShhdXRoRGF0YSk7XG4gICAgJHJvb3RTY29wZS5ub3RpZnkoXCJBdXRoZW50aWNhdGVkIHN1Y2Nlc3NmdWxseSFcIik7XG4gICAgJHJvb3RTY29wZS51c2VyaWQgPSBhdXRoRGF0YS5pZDtcbiAgICAkcm9vdFNjb3BlLmF1dGhEYXRhID0gYXV0aERhdGE7XG4gICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAkcm9vdFNjb3BlLmhpZGUoKTtcbiAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhdmVVc2VyUHJvZmlsZSggYXV0aERhdGEpIHtcbiAgICBhdXRoRGF0YS51cGRhdGVkID0gRmlyZWJhc2UuU2VydmVyVmFsdWUuVElNRVNUQU1QO1xuICAgIC8qIFNBVkUgUFJPRklMRSBEQVRBICovXG4gICAgdmFyIHVzZXJzUmVmID0gZmlyZUJhc2VEYXRhLnJlZlVzZXJzKCk7XG4gICAgLy91c2UgdWlkIGFzIElELCBpZiB0aGUgdXNlciBsb2dzIGluIGFnYWluLCB3ZSBzaW1wbHkgdXBkYXRlIHRoZSBwcm9maWxlIGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgb25lXG4gICAgdXNlcnNSZWYuY2hpbGQoYXV0aERhdGEudWlkKS5zZXQoYXV0aERhdGEpO1xuXG4gIH07XG4gIC8vVE9ETzogbWFrZSBzdXJlIHVzZXJzIGNhbm5vdCBsb2cgaW4gYWdhaW4gYWZ0ZXIgYWxyZWFkeSBsb2dnZWQgaW4uIG9ubHkgbG9nIG91dC5cblxuICAkc2NvcGUuc2lnbkluID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAkcm9vdFNjb3BlLnNob3coJ0xvZ2dpbmcgSW4uLi4nKTtcblxuICAgIC8qIENoZWNrIHVzZXIgZmllbGRzKi9cbiAgICBpZiAoIXVzZXIgfHwgIXVzZXIuZW1haWwgfHwgIXVzZXIucGFzc3dvcmQpIHtcbiAgICAgICRyb290U2NvcGUubm90aWZ5KCdFcnJvcicsICdFbWFpbCBvciBQYXNzd29yZCBpcyBpbmNvcnJlY3QhJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyogQWxsIGdvb2QsIGxldCdzIGF1dGhlbnRpZnkgKi9cbiAgICBmaXJlQmFzZURhdGEucmVmKCkuYXV0aFdpdGhQYXNzd29yZCh7XG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkXG4gICAgfSwgZnVuY3Rpb24gKGVycm9yLCBhdXRoRGF0YSkge1xuICAgICAgaWYgKGVycm9yID09PSBudWxsKSB7XG4gICAgICAgIG9uTG9naW5TdWNjZXNzKGF1dGhEYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgICAgICAgIGNhc2UgXCJJTlZBTElEX0VNQUlMXCI6XG4gICAgICAgICAgICAkcm9vdFNjb3BlLm5vdGlmeShcIlRoZSBzcGVjaWZpZWQgdXNlciBhY2NvdW50IGVtYWlsIGlzIGludmFsaWQuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIklOVkFMSURfUEFTU1dPUkRcIjpcbiAgICAgICAgICAgICRyb290U2NvcGUubm90aWZ5KFwiVGhlIHNwZWNpZmllZCB1c2VyIGFjY291bnQgcGFzc3dvcmQgaXMgaW5jb3JyZWN0LlwiKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJJTlZBTElEX1VTRVJcIjpcbiAgICAgICAgICAgICRyb290U2NvcGUubm90aWZ5KFwiVGhlIHNwZWNpZmllZCB1c2VyIGFjY291bnQgZG9lcyBub3QgZXhpc3QuXCIpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICRyb290U2NvcGUubm90aWZ5KFwiRXJyb3IgbG9nZ2luZyB1c2VyIGluOlwiLCBlcnJvcik7XG5cbiAgICAgICAgfVxuICAgICAgICAkcm9vdFNjb3BlLmhpZGUoKTtcbiAgICAgICAgJHJvb3RTY29wZS5ub3RpZnkoJ0Vycm9yJywgJ0VtYWlsIG9yIFBhc3N3b3JkIGlzIGluY29ycmVjdCEnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuZmFjZWJvb2tMb2dpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGZpcmVCYXNlRGF0YS5yZWYoKS5hdXRoV2l0aE9BdXRoUG9wdXAoXCJmYWNlYm9va1wiLCBmdW5jdGlvbiAoZXJyb3IsIGF1dGhEYXRhKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgJHJvb3RTY29wZS5ub3RpZnkoXCJMb2dpbiBGYWlsZWQhXCIsIGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uTG9naW5TdWNjZXNzKGF1dGhEYXRhKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBzY29wZTogXCJlbWFpbCxwdWJsaWNfcHJvZmlsZSx1c2VyX2dhbWVzX2FjdGl2aXR5LHVzZXJfbG9jYXRpb25cIlxuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5nb29nbGVMb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBmaXJlQmFzZURhdGEucmVmKCkuYXV0aFdpdGhPQXV0aFBvcHVwKFwiZ29vZ2xlXCIsIGZ1bmN0aW9uIChlcnJvciwgYXV0aERhdGEpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAkcm9vdFNjb3BlLm5vdGlmeShcIkxvZ2luIEZhaWxlZCFcIiwgZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25Mb2dpblN1Y2Nlc3MoYXV0aERhdGEpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHNjb3BlOiBcImVtYWlsLHByb2ZpbGVcIlxuICAgIH0pO1xuICB9O1xuICAkc2NvcGUudHdpdHRlckxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgIGZpcmVCYXNlRGF0YS5yZWYoKS5hdXRoV2l0aE9BdXRoUG9wdXAoXCJ0d2l0dGVyXCIsIGZ1bmN0aW9uIChlcnJvciwgYXV0aERhdGEpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAkcm9vdFNjb3BlLm5vdGlmeShcIkxvZ2luIEZhaWxlZCFcIiwgZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25Mb2dpblN1Y2Nlc3MoYXV0aERhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG59KVxuXG4uY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkZmlyZWJhc2UsIGZpcmVCYXNlRGF0YSwgJGZpcmViYXNlQXV0aCwgJGh0dHApIHtcbiAgJHNjb3BlLmhpZGVCYWNrQnV0dG9uID0gdHJ1ZTtcblxuICAkc2NvcGUuY3JlYXRlVXNlciA9IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgdmFyIGZpcnN0bmFtZSA9IHVzZXIuZmlyc3RuYW1lO1xuICAgIHZhciBzdXJuYW1lID0gdXNlci5zdXJuYW1lO1xuICAgIHZhciBlbWFpbCA9IHVzZXIuZW1haWw7XG4gICAgdmFyIHBhc3N3b3JkID0gdXNlci5wYXNzd29yZDtcbiAgICBcbiAgICBpZiAoIWZpcnN0bmFtZSB8fCAhc3VybmFtZSB8fCAhZW1haWwgfHwgIXBhc3N3b3JkKSB7XG4gICAgICAkcm9vdFNjb3BlLm5vdGlmeShcIlBsZWFzZSBlbnRlciB2YWxpZCBjcmVkZW50aWFsc1wiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgJHJvb3RTY29wZS5zaG93KCdSZWdpc3RlcmluZy4uLicpO1xuXG4gICAgdmFyIGF1dGggPSAkZmlyZWJhc2VBdXRoKGZpcmVCYXNlRGF0YS5yZWYoKSk7XG4gICAgdmFyIHNhdmVVc2VyUHJvZmlsZSA9IGZ1bmN0aW9uIChhdXRoRGF0YSkge1xuICAgICAgYXV0aERhdGEudXBkYXRlZCA9IEZpcmViYXNlLlNlcnZlclZhbHVlLlRJTUVTVEFNUDtcbiAgICAgIHZhciB0ZW1wID0ge307XG4gICAgICB0ZW1wLmZpcnN0bmFtZSA9IHVzZXIuZmlyc3RuYW1lO1xuICAgICAgdGVtcC5sYXN0bmFtZSA9IHVzZXIuc3VybmFtZTtcbiAgICAgIGF1dGhEYXRhLnVzZXIgPSB0ZW1wO1xuICAgICAgLyogU0FWRSBQUk9GSUxFIERBVEEgKi9cbiAgICAgIHZhciB1c2Vyc1JlZiA9IGZpcmVCYXNlRGF0YS5yZWZVc2VycygpO1xuICAgICAgdXNlcnNSZWYuY2hpbGQoYXV0aERhdGEudWlkKS5zZXQoYXV0aERhdGEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHJvb3RTY29wZS5oaWRlKCk7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKVxuICAgICAgICAkcm9vdFNjb3BlLm5vdGlmeSgnRW50ZXIgeW91ciBlbWFpbCBhbmQgcGFzc3dvcmQgdG8gbG9naW4uICcpO1xuICAgICAgICA7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBzZW5kRW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIHVybDogJy9zZW5kbWFpbCcsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGE6IHsnZW1haWwnOiBlbWFpbH0sXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgICAgIH07XG4gICAgICAgICRodHRwKHJlcSkuc3VjY2VzcyhmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICBpZiAocmVzICYmIHJlc1swXS5zdGF0dXMgPT0gJ3NlbnQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZW1haWwgc2VudCB0byAnICsgcmVzWzBdLmVtYWlsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VtYWlsIG5vdCBzZW50Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhdXRoLiRjcmVhdGVVc2VyKGVtYWlsLCBwYXNzd29yZCkudGhlbihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBhdXRoLiRhdXRoV2l0aFBhc3N3b3JkKHtcbiAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLnRoZW4oc2F2ZVVzZXJQcm9maWxlKVxuICAgIC50aGVuKHNlbmRFbWFpbClcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAkcm9vdFNjb3BlLmhpZGUoKTtcbiAgICAgIGlmIChlcnJvci5jb2RlID09ICdJTlZBTElEX0VNQUlMJykge1xuXG4gICAgICAgICRyb290U2NvcGUubm90aWZ5KCdFcnJvcicsICdJbnZhbGlkIEVtYWlsLicpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZXJyb3IuY29kZSA9PSAnRU1BSUxfVEFLRU4nKSB7XG4gICAgICAgICRyb290U2NvcGUubm90aWZ5KCdFcnJvcicsICdFbWFpbCBhbHJlYWR5IHRha2VuLicpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICRyb290U2NvcGUubm90aWZ5KCdFcnJvcicsICdPb3BzLiBTb21ldGhpbmcgd2VudCB3cm9uZy4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9