angular.module('starter.services', [])

.factory('fireBaseData', ['$firebase', 'utility', function ($firebase, utility) {
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
    saveValuation: function saveValuation(value, authData, property) {
      if (refUser == null || authData == null) {
        return;
      }

      if (authData.reputation == null) {
        authData.reputation = 0;
      }

      var accuracy = 100 - Math.abs((property.crowdvalue - value) / property.crowdvalue) * 100;

      if (accuracy < 0) {
        accuracy = 0;
      }
      console.log('accuracy: ' + accuracy);

      var newrepuationTotal = property.totalReputation + accuracy;
        
      //paramaters used to update reputation
      var passAccuracy = 70,
          maxReputation = 100;
      // adjuststed score between -30 and 30
      var adjustedScore = accuracy - passAccuracy;
      if (adjustedScore < passAccuracy - 100) {
          adjustedScore = passAccuracy - 100;
      }
      var userExp = (authData.reputation) ? utility.reputationToExp(authData.reputation) + adjustedScore : adjustedScore;
      if (userExp < 0) {
          userExp = 0;
      }
      var userReputation = utility.expToReputation(userExp);
      if (userReputation > maxReputation) {
          userReputation = maxReputation;
      }
        
      console.log("old reputation: " + authData.reputation);
      console.log("user new reputation: " + userReputation);

      var valuation = {
        "created": Firebase.ServerValue.TIMESTAMP,
        "homeID": property.$id,
        "homeValue": property.crowdvalue,
        "homeReputation": property.totalReputation,
        "userID": authData.uid,
        "userSubmittedValue": parseInt(value),
        "userReputation": authData.reputation,
        "accuracy": accuracy
      };
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
    },
    reputationToExp: function reputationToExp(rep, base, scale) {
        base = base || 10;
        scale = scale || 1.1;
        var exp = base * (Math.pow(scale, rep) - 1) / (scale - 1);
        return exp;
    },
    expToReputation: function expToReputation(exp, base, scale) {
        base = base || 10;
        scale = scale || 1.1;
        var rep = Math.log(exp * (scale-1) / base + 1) / Math.log(scale);
        return rep;
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
    homeTypes: [
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
    buildingTypes: [
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
    bedRooms: [0, 1, 2, 3, 4],
    bathRooms: [0, 1, 2, 3, 4],
    additionalSpace: ['Den', 'Sunroom'],
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
    parkingSpace: [0, 1, 2, 3, 4],
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
    orientation: ["North", "East", "South", "West"],
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