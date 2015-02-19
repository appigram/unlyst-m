angular.module('starter.services', [])

.factory('fireBaseData', ['$firebase', 'utility', function ($firebase, utility) {
  //gulp-preprocess to change FIREBASE to production URL see root/gulpfile.js
  //Do not remove the comments below.
  var homeInfo;
  var valuationData;
  var bumpData;
  var refUserConfig;
  var refConfig = 'https://fiery-heat-1976.firebaseio.com';

  /* @if NODE_ENV='production' */
  homeInfo = 'https://fiery-heat-1976.firebaseio.com/unlyst/';
  valuationData = 'https://fiery-heat-1976.firebaseio.com/valuations-prod';
  refUserConfig = 'https://fiery-heat-1976.firebaseio.com/user/';
  bumpData ='https://fiery-heat-1976.firebaseio.com/bump-prod/';
  /* @endif */

  /* @if NODE_ENV='development' */
  homeInfo = 'https://fiery-heat-1976.firebaseio.com/unlyst-test/';
  valuationData = 'https://fiery-heat-1976.firebaseio.com/valuations';
  refUserConfig = "https://fiery-heat-1976.firebaseio.com/user-test/";
  bumpData ='https://fiery-heat-1976.firebaseio.com/bump-test/';
  /* @endif */

  var ref = new Firebase(refConfig);
  var refHomes = new Firebase(homeInfo);
  var refValuation = new Firebase(valuationData);
  var refUser = new Firebase(refUserConfig);
  var refBump = new Firebase(bumpData);
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
      //has this user valued this property before?
      var valuedBefore = false;
      if (authData.valuations) {
        valuedBefore = utility.hasValuedPropertyBefore(authData.valuations, property.houseId.toString());
        if (valuedBefore && !authData.admin) {
          console.log('User valued this property before');
          return;
        }
      }

      if (!authData.reputation) {
        authData.reputation = 10;
      }

      var accuracy = utility.getAccuracy(value, property.crowdvalue);

      if (accuracy < 0) {
        accuracy = 0;
      }
      if (!property.totalReputation) {
        property.totalReputation = 500;
      }

      var userReputation = utility.updateReputation(accuracy, authData.reputation);
      var newrepuationTotal = property.totalReputation + userReputation;
      var newCrowdValue = (property.crowdvalue * property.totalReputation +
      value * userReputation) / (property.totalReputation + userReputation);
      authData.reputation = userReputation;

      var valuation = {
        "created": Firebase.ServerValue.TIMESTAMP,
        "homeID": property.houseId,
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
      refHomes.child(property.$id + '/crowdvalue').set(newCrowdValue);
      return 1;
    },
    saveBump: function saveValuation(value, authData, property) {

      if (refUser == null || authData == null) {
        return;
      }
      //has this user valued this property before?
      var valuedBefore = false;
      if (authData.bumps) {
        valuedBefore = utility.hasValuedPropertyBefore(authData.bumps, property.houseId.toString());
        if (valuedBefore) {
          console.log('User valued this property before');
          return;
        }
      }
      if (!property.bumpvalue) {
        property.bumpvalue = property.crowdvalue;
        refHomes.child(property.$id + '/bumpvalue').set(property.crowdvalue);
      }
      var newBumpValue = property.bumpvalue;
      if (value === true) {
        newBumpValue = property.bumpvalue * 1.02;
      } else {
        newBumpValue = property.bumpvalue * 0.98;
      }
      property.bumpChange = newBumpValue - property.bumpvalue;
      property.bumpvalue = newBumpValue;
      console.log('bump value:' + newBumpValue);
      console.log('bump value changed :' + property.bumpChange);
      var bump = {
        "created": Firebase.ServerValue.TIMESTAMP,
        "homeID": property.houseId,
        "homeValue": newBumpValue,
        "userID": authData.uid,
        "userSubmittedqValue": value
      };
      refBump.push(bump);
      refUser.child(authData.uid + '/bump').push(bump);
      refHomes.child(property.$id + '/bumps').push(bump);
      refHomes.child(property.$id + '/bumpvalue').set(newBumpValue);
    },
    getUserDisplayName: function (rootAuth) {
      var name;
      if (!rootAuth) {
        return null;
      } else if (rootAuth.provider === 'google') {
        name = rootAuth.google.displayName;
      } else if (rootAuth.provider === 'facebook') {
        name = rootAuth.facebook.displayName;
      } else if (rootAuth.provider === 'twitter') {
        name = rootAuth.twitter.displayName;
      } else if (rootAuth.provider === 'password') {
        if (rootAuth.user == null) {
          return '';
        }
        name = rootAuth.user.firstname + ' ' + rootAuth.user.lastname;
      } else if (rootAuth.provider === 'anonymous') {
        name = 'anonymous user';
      }

      var full = false;
      if (full) {
        return name;
      } else {
        return name.split(' ')[0]
      }
    },
    getUserProfilePicture: function (rootAuth) {
      if (!rootAuth) {
        return null;
      }
      else if (rootAuth.provider === 'google') {
        return rootAuth.google.cachedUserProfile.picture;
      }
      else if (rootAuth.provider === 'facebook') {
        return rootAuth.facebook.cachedUserProfile.picture.data.url;
      }
      else if (rootAuth.provider === 'twitter') {
        return rootAuth.twitter.cachedUserProfile.profile_image_url;
      }
      else if (rootAuth.provider === 'password') {
        return 'dist/img/home-thumbnail';
      }

    },
    likesHome: function (rootAuth, houseId) {
      if (!rootAuth) {
        return;
      }
      refUser.child(rootAuth.uid + '/likedHomes').push({'homeID': houseId, "created": Firebase.ServerValue.TIMESTAMP});
      return 1;
    }
  }
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
    // exp = base + base*scale + base*scale^2 + ... + base*scale^rep
    reputationToExp: function reputationToExp(rep, base, scale) {
      base = base || 5;
      scale = scale || 1.1;
      var exp = base * (Math.pow(scale, rep) - 1) / (scale - 1);
      return exp;
    },
    expToReputation: function expToReputation(exp, base, scale) {
      base = base || 5;
      scale = scale || 1.1;
      var rep = Math.log(exp * (scale - 1) / base + 1) / Math.log(scale);
      return rep;
    },
    updateReputation: function updateReputation(accuracy, reputation) {
      //paramaters used to update reputation
      var passAccuracy = 70,
      maxReputation = 100,
      initialValue = 10;
      if (!reputation) {
        return initialValue;
      }
      // adjuststed score between -30 and 30
      var adjustedScore = accuracy - passAccuracy;
      if (adjustedScore < passAccuracy - 100) {
        adjustedScore = passAccuracy - 100;
      }
      var userExp = (reputation) ? this.reputationToExp(reputation) + adjustedScore : adjustedScore;
      if (userExp < 0) {
        userExp = 0;
      }
      var newReputation = this.expToReputation(userExp);
      if (newReputation > maxReputation) {
        newReputation = maxReputation;
      }
      return newReputation;
    },
    getAccuracy: function getAccuracy(userValue, crowdValue) {
      var accuracy = (1 - Math.abs(userValue - crowdValue) / crowdValue) * 100;
      if (accuracy < 0) {
        accuracy = 0;
      }
      return accuracy;
    },
    hasValuedPropertyBefore: function (valuations, homeID) {
      var valuedBefore = false;
      //angular forEach does not support break
      angular.forEach(valuations, function (value, key) {
        if (value.homeID.toString() === homeID) {
          valuedBefore = true;
          return;
        }
      });
      return valuedBefore;
    }
  }
}])

.factory('geocoding', [function () {
  var geocoder = new google.maps.Geocoder();
  //hard coded for now
  var city = 'Toronto';
  // geocoding API request
  var getResult = function (processResult) {
    return function (address, callback) {
      address = address + ', ' + city;
      console.log('address: ' + address);
      geocoder.geocode({'address': address}, function (results, status) {
        var result;
        if (status == google.maps.GeocoderStatus.OK) {
          result = processResult(results);
        } else {
          console.log(status);
        }
        if (typeof callback == 'function') {
          callback(result);
        }
      });
    }
  };
  var parseResult = function (results) {
    var coordinates = results[0].geometry.location;
    var components = results[0].address_components;
    var postal_code, neighborhood;
    for (var i = 0; i < components.length; i += 1) {
      if (components[i].types.indexOf('neighborhood') >= 0) {
        neighborhood = components[i].long_name;
      }
      if (components[i].types.indexOf('postal_code') >= 0) {
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
        name: "High-rise (12+ Storeys)",
        value: "highRise"
      },
      {
        name: "Mid-rise(4-12 Storeys)",
        value: "midRise"
      },
      {
        name: "Low-rise(1-4 Storeys)",
        value: "lowRise"
      }
    ],
    bedRooms: [0, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    bathRooms: [0, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    additionalSpace: ['Study', 'Sunroom', 'Storage locker'],
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
        value: "aboveGroundGrg"
      },
      {
        name: "Driveway",
        value: "driveway"
      }
    ],
    parkingSpace: [0, 1, 2, '2(Tandem)', 3, '3(Tandem)', 4],
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
        name: "Concierge (24h)",
        value: "conciergeFullTime"
      },
      {
        name: "Sauna",
        value: "sauna"
      },
      {
        name: "Concierge (<24h)",
        value: "concierge"
      },
      {
        name: "Spa",
        value: "spa"
      },
      {
        name: "Gym",
        value: "gym"
      },
      {
        name: "Games Room",
        value: "gamesRoom"
      },
      {
        name: "Party Room",
        value: "partyRoom"
      },
      {
        name: "Boardroom",
        value: "boardRoom"
      },
      {
        name: "Steam Room",
        value: "steamRoom"
      },
      {
        name: "Pet Wash",
        value: "petWash"
      },
      {
        name: "Car Wash",
        value: "carWash"
      },
      {
        name: "Theater Room",
        value: "theaterRoom"
      },
      {
        name: "Visitor Parking",
        value: "visitorParking"
      },
      {
        name: "Guest Suites",
        value: "guestSuites"
      },
      {
        name: "Pool",
        value: "pool"
      },
      {
        name: "Other",
        value: "other"
      }
    ],
    lat: 0,
    lng: 0
  };
  return homeSchema;
}]);
