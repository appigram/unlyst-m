angular.module('starter.services', [])

.factory('houseDB', ["$firebase", function ($firebase) {
  var ref = new Firebase("https://fiery-heat-1976.firebaseio.com/unlyst/");
  var sync = $firebase(ref);
  return sync.$asArray();
}
])

.factory('valuationDB', ["$firebase", function () {
  //gulp-preprocess to change FIREBASE to production URL see root/gulpfile.js
  var configValue;

  configValue = 'https://fiery-heat-1976.firebaseio.com/valuations';

  var ref = new Firebase(configValue);
  return ref;
}
])

.factory('utility', [function () {
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
    }
  };
}]);