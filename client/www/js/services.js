angular.module('starter.services', [])

.factory('houseDB', ["$firebase", function ($firebase) {
  //gulp-preprocess to change FIREBASE to production URL see root/gulpfile.js
  //Do not remove the comments below.
  var configValue;
  /* @if NODE_ENV='production' */
  configValue = 'https://fiery-heat-1976.firebaseio.com/unlyst/';
  /* @endif */

  /* @if NODE_ENV='development' */
  configValue = 'https://fiery-heat-1976.firebaseio.com/unlyst-test/';
  /* @endif */
  var ref = new Firebase(configValue);
  return ref;
}
])

.factory('valuationDB', ["$firebase", function () {
  //gulp-preprocess to change FIREBASE to production URL see root/gulpfile.js
  //Do not remove the comments below. 
  var configValue;
  /* @if NODE_ENV='production' */
  configValue = 'https://fiery-heat-1976.firebaseio.com/valuations-prod';
  /* @endif */

  /* @if NODE_ENV='development' */
  configValue = 'https://fiery-heat-1976.firebaseio.com/valuations';
  /* @endif */

  var ref = new Firebase(configValue);
  return ref;
}
])

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
      return size*500;
    },
    maxCondoValue: function calculateDefaultValue(size) {
      //var randomScale = window.Math.floor((window.Math.random() * -0.2) + 0.2);
      if(size*1000 > 1000000) {
        return size*1000;
      }
      //mininum value of 1 mil
      return 1000000;
    }
  };
}]);