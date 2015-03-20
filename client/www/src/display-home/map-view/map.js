starterControllers

.controller('MapViewCtrl', ['$scope', '$rootScope', 'fireBaseData', '$firebase', 'utility',
  function ($scope, $rootScope, fireBaseData, $firebase, utility) {
    $scope.map = {};

    var homes = $firebase(fireBaseData.refHomes()).$asArray();
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

    homes.$loaded().then(function () {
      var homeJson = JSON.parse(JSON.stringify(homes));
      $scope.homeList = homeJson;
      $scope.markers = {};
      angular.forEach(homeJson, function (value, key) {
        if (value.houseId) {
          var homeID = value.houseId;
          var marker = {
            lat: value.lat,
            lng: value.lng,
            focus: true,
            draggable: false,
            title: 'marker',
            label: {
              message: '<div class="text-center" ui-sref="home({id:' + value.houseId + '})">'+  value.address+ '</div>',
              //+ '<md-button class="md-warn md-raised" ui-sref="home({id:' + value.houseId + '})">View Details' + '</md-button>',
              options: {
                noHide: true
              }
            }
          };
          $scope.markers[homeID] = marker;
        }
      });
      var defaultzoom = 13;
      //center at toronto downtown
      $scope.map = {
        lat: 43.6671214,
        lng: -79.3911985,
        zoom: defaultzoom
      };

    });
  }]);