angular.module('starter.services', [])

.factory('fireBaseData', ["$firebase", function ($firebase) {
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
      return homeSchema;
}])