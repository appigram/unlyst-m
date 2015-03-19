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
  var defaultzoom = 15;
  $scope.$on('updateMap', function (event, property) {

    $scope.map = {
      lat: property.lat,
      lng: property.lng,
      zoom: defaultzoom
    };
    $scope.markers = {
      property: {
        lat: property.lat,
        lng: property.lng,
        focus: true,
        draggable: false
      }
    };
  });
});