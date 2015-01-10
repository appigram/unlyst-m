angular.module('starter.services', [])

.factory('fireBaseData', ["$firebase", function ($firebase,$rootScope) {
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

      if(refUser==null){
        return;
      }

      if(authData.reputation == null){
        authData.reputation = 0;
      }

      var accuracy = 100 - Math.abs((property.crowdvalue - valuation) / property.crowdvalue)*100;

      if(accuracy < 0) {
        accuracy = 0;
      }

      var valuation = {
        "created": Firebase.ServerValue.TIMESTAMP,
        "homeID": property.$id,
        "homeValue":property.crowdvalue,
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
      var userReputation;
      var adjustedScore;
      if(accuracy-70 <= 0 ){
        adjustedScore = 0;
      } else {
        adjustedScore = (accuracy-70)/10;
        console.log("adjusted score: " + adjustedScore);
        userReputation = Math.log(adjustedScore + authData.reputation) / Math.log(1.1);
        //if total reputation is less than 1, it will be negative
        if(userReputation==null || userReputation<0){
          userReputation = 0;
        }
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