angular.module('starter.controllers', ["firebase"])

  .factory('houseDB', ["$firebase", function ($firebase) {
    var ref = new Firebase("https://fiery-heat-1976.firebaseio.com/unlyst/");
    var sync = $firebase(ref);
    return sync.$asArray();
  }
  ])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('FriendsCtrl', function ($scope, Friends) {
    $scope.friends = Friends.all();
  })

  .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
  })

  .controller('AccountCtrl', function ($scope) {
  })

  .controller('CardsCtrl', function ($scope, TDCardDelegate) {
    console.log('CARDS CTRL');
    var cardTypes = [
      {image: 'https://pbs.twimg.com/profile_images/479740132258361344/KaYdH9hE.jpeg'},
      {image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'},
      {image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'},
    ];

    $scope.cards = Array.prototype.slice.call(cardTypes, 0);

    $scope.cardDestroyed = function (index) {
      $scope.cards.splice(index, 1);
    };

    $scope.addCard = function () {
      var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      newCard.id = Math.random();
      $scope.cards.push(angular.extend({}, newCard));
    }
  })

  .controller('CardCtrl', function ($scope, TDCardDelegate) {
    $scope.cardSwipedLeft = function (index) {
      console.log('LEFT SWIPE');
      $scope.addCard();
    };
    $scope.cardSwipedRight = function (index) {
      console.log('RIGHT SWIPE');
      $scope.addCard();
    };
  })

  .controller('HomeCtrl', function ($scope, houseDB, $ionicModal, $ionicSlideBoxDelegate) {
    $scope.activeSlide = 3;
    //bind model to scoep; set valuation
    $scope.home = {};

    $scope.valuation = $scope.home.valuation;
    $scope.score = ($scope.crowdvalue - $scope.home.valuation) / $scope.crowdvalue * 10;
    $scope.Math = window.Math;
    $scope.totalScore = 0;
    $scope.playCount = 0;
    $scope.avgScore = 0;
      console.log($scope.score);
      console.log($scope.home);
    //init firebase
    houseDB.$loaded().then(function () {
      var houses = houseDB;
      var i = 0;
      $scope.likes = 20;
      $scope.imgurl = houses[i].img;
      $scope.bedRmNum = houses[i].bedRmNum;
      $scope.bathRmNum = houses[i].bathRmNum;
      $scope.houseType = houses[i].houseType;
      $scope.houseSize = houses[i].size;
      $scope.lotSize = houses[i].landSize;
      $scope.stories = houses[i].stories;
      $scope.orientation = houses[i].orientation;
      $scope.parking = houses[i].parkingNum;
      $scope.parkingType = houses[i].parkingType;
      $scope.outdoorSpace = houses[i].outdoorSpace;
      $scope.buildYr = 2014 - houses[i].buildYr;
      $scope.address = houses[i].address1;
      $scope.neighborhood = houses[i].neighborhood;
      $scope.city = houses[i].city;
      $scope.hideDetail = true;
      $scope.expertvalue = houses[i].expertvalue;
      $scope.crowdvalue = houses[i].crowdvalue;
      console.log($scope.home);

      $ionicModal.fromTemplateUrl('templates/modal.html', function (modal) {
        $scope.modal = modal;

      }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope
        // The animation we want to use for the modal entrance
        //animation: 'slide-in-up'
      });
      $scope.submitScore = function () {
        $scope.score = 10 - Math.abs(($scope.crowdvalue - $scope.home.valuation) / $scope.crowdvalue * 10);
        console.log($scope.home.valuation);
        console.log($scope.score);
        if ($scope.score < 0) {
          $scope.score = 0;
        }
        $scope.totalScore += $scope.score;
        $scope.playCount++;
        $scope.avgScore = $scope.totalScore / $scope.playCount;

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
        $scope.clickNext();
      });

      $scope.clickNext = function () {
        setTimeout(function () {
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
            $scope.likes = 20;
            $scope.imgurl = houses[i].img;
            $scope.bedRmNum = houses[i].bedRmNum;
            $scope.bathRmNum = houses[i].bathRmNum;
            $scope.houseType = houses[i].houseType;
            $scope.houseSize = houses[i].size;
            $scope.lotSize = houses[i].landSize;
            $scope.stories = houses[i].stories;
            $scope.orientation = houses[i].orientation;
            $scope.parking = houses[i].parkingNum;
            $scope.parkingType = houses[i].parkingType;
            $scope.outdoorSpace = houses[i].outdoorSpace;
            $scope.buildYr = 2014 - houses[i].buildYr;
            $scope.address = houses[i].address1;
            $scope.neighborhood = houses[i].neighborhood;
            $scope.city = houses[i].city;
            $scope.hideDetail = true;
            $scope.expertvalue = houses[i].expertvalue;
            $scope.crowdvalue = houses[i].crowdvalue;
          }
          else {
            i = 0;
            $scope.likes = 20;
            $scope.imgurl = houses[i].img;
            $scope.bedRmNum = houses[i].bedRmNum;
            $scope.bathRmNum = houses[i].bathRmNum;
            $scope.houseType = houses[i].houseType;
            $scope.houseSize = houses[i].size;
            $scope.lotSize = houses[i].landSize;
            $scope.stories = houses[i].stories;
            $scope.orientation = houses[i].orientation;
            $scope.parking = houses[i].parkingNum;
            $scope.parkingType = houses[i].parkingType;
            $scope.outdoorSpace = houses[i].outdoorSpace;
            $scope.buildYr = 2014 - houses[i].buildYr;
            $scope.address = houses[i].address1;
            $scope.neighborhood = houses[i].neighborhood;
            $scope.city = houses[i].city;
            $scope.hideDetail = true;
            $scope.expertvalue = houses[i].expertvalue;
            $scope.crowdvalue = houses[i].crowdvalue;
          }
        }, 800);

      };
    });

  });