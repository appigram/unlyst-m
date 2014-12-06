angular.module('starter.controllers', [])

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
  .controller('HomeCtrl', function($scope, $ionicModal,$ionicSlideBoxDelegate) {
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    $scope.valuation = 400000;
    // Load the modal from the given template URL
    // somehow need to move ionicmodal first

    var TYPE = ['CONDO', 'DETACHED', 'SEMEI-DETACHED'];
    var i = 0;
    $scope.test = $scope.data;
    var houses = [
      {
        "houseId " : 1,
        "address1" : "625 - 1 Market Street",
        "city": "Toronto",
        "houseType" : "Condo",
        "size" : 642,
        "bedRmNum": 1,
        "bathRmNum": 1,
        "parkingNum": 1,
        "stories": 1,
        "parkingType": "Garage",
        "outdoorSpace": "Terrace",
        "orientation": "East",
        "buildYr": 5,
        "landSize": 0,
        "maintFee": 360,
        "neighborhood" : 'St Lawrence Market',
        "img": ["img/homes/1_Market_Street _625/Floor-plan.jpg","img/homes/1_Market_Street _625/MarketWharf-1bed-living-room.jpg",
                "img/homes/1_Market_Street _625/MW-1BED-bath.jpg", "img/homes/1_Market_Street _625/MW-1bed-bed.jpg",
                "img/homes/1_Market_Street _625/MW-1bed-kitchen1.jpg", "img/homes/1_Market_Street _625/MW-1bed-kitchen2.jpg",
                "img/homes/1_Market_Street _625/MW-1bed-main.jpg", "img/homes/1_Market_Street _625/MW-1bed-main2.jpg",
                "img/homes/1_Market_Street _625/MW-1BED-MAIN3.jpg", "img/homes/1_Market_Street _625/urbantoronto-7363-25184.jpg"],
        "score": 88,
        "scoremsg": "That was so close",
        "expertvalue":689600,
        "crowdvalue":695850
      },
      {
        "houseId " : 2,
        "address1" : "422 - 68 Broadview Ave",
        "city": "Toronto",
        "houseType" : "Condo",
        "size" : 1050,
        "bedRmNum": 1,
        "bathRmNum": 1,
        "parkingNum": 2,
        "stories": 1,
        "additionalSpace": "locker",
        "parkingType": "Underground",
        "outdoorSpace": "Balcony",
        "orientation": "West",
        "buildYr": 5,
        "landSize": 0,
        "maintFee": 450,
        "neighborhood" : 'A Neighborhood',
        "img": ["img/homes/68_Broadview_Avenue_422/1.png", "img/homes/68_Broadview_Avenue_422/2.png",
          "img/homes/68_Broadview_Avenue_422/3.png", "img/homes/68_Broadview_Avenue_422/4.png",
          "img/homes/68_Broadview_Avenue_422/5.png", "img/homes/68_Broadview_Avenue_422/6.png",
          "img/homes/68_Broadview_Avenue_422/7.png", "img/homes/68_Broadview_Avenue_422/8.png",
          "img/homes/68_Broadview_Avenue_422/9.png", "img/homes/68_Broadview_Avenue_422/10.png",
          "img/homes/68_Broadview_Avenue_422/11.png", "img/homes/68_Broadview_Avenue_422/12.png",
          "img/homes/68_Broadview_Avenue_422/13.png", "img/homes/68_Broadview_Avenue_422/14.png",
          "img/homes/68_Broadview_Avenue_422/15.png", "img/homes/68_Broadview_Avenue_422/16.png"],
        "score": 88,
        "scoremsg": "That was so close",
        "expertvalue":583600,
        "crowdvalue":592810
      },
      {
        "houseId " : 3,
        "address1" : "777 Bay Street",
        "houseType" : "Condo",
        "size" : 3000,
        "bedRmNum": 2,
        "bathRmNum": 2,
        "parkingNum": 1,
        "buildYr": 5,
        "landSize": 1000,
        "maintFee": null,
        "img": ["img/homes/house3_1.jpg","img/homes/house3_2.jpg","img/homes/house3_3.jpg","img/homes/house3_4.jpg"],
        "score": 95,
        "scoremsg": "Awesome!",
        "expertvalue":719360,
        "crowdvalue":725850
      }
    ];

    $scope.likes = 20;
    $scope.imgurl = houses[i].img;
    $scope.bedRmNum =houses[i].bedRmNum;
    $scope.bathRmNum = houses[i].bathRmNum;
    $scope.houseType = houses[i].houseType;
    $scope.houseSize = houses[i].size;
    $scope.lotSize = houses[i].landSize;
    $scope.stories = houses[i].stories;
    $scope.orientation = houses[i].orientation;
    $scope.parking = houses[i].parkingNum > 0? 'Yes' : 'No';
    $scope.parkingType = houses[i].parkingType;
    $scope.outdoorSpace = houses[i].outdoorSpace;
    $scope.buildYr = 2014 - houses[i].buildYr;
    $scope.address = houses[i].address1;
    $scope.neighborhood = houses[i].neighborhood;
    $scope.city = houses[i].city;
    $scope.hideDetail = true;
    $scope.score = 88;
    $scope.scoremsg ="That was so close";
    $scope.expertvalue =689600;
    $scope.crowdvalue =695850;


    //bind model to scoep; set valuation
    $scope.home = {};

    $scope.valuation = $scope.home.valuation;
    $scope.score = ($scope.crowdvalue- $scope.home.valuation)/$scope.crowdvalue*10;
    $scope.Math = window.Math;
    $scope.totalScore = 0;
    $scope.playCount = 0;
    $scope.avgScore = 0;
    $ionicModal.fromTemplateUrl('templates/modal.html', function(modal) {
      $scope.modal = modal;

    }, {
      // Use our scope for the scope of the modal to keep it simple
      scope: $scope,
      // The animation we want to use for the modal entrance
      animation: 'slide-in-up'
    });
    $scope.submitScore = function(){
      $scope.score = 10 - Math.abs(($scope.crowdvalue- $scope.home.valuation)/$scope.crowdvalue*10);
      $scope.totalScore += $scope.score;
      $scope.playCount++;
      console.log('score:'+ $scope.score);
      console.log('playcount:'+ $scope.playCount);
      $scope.avgScore = $scope.totalScore/$scope.playCount;

    };

    // Called each time the slide changes
    $scope.slideHasChanged = function(index) {
      $ionicSlideBoxDelegate.update();
    };

    $scope.clickNext = function() {
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.slide(0);
      console.log("click Next")
      var length = houses.length;
      $scope.hideDetail = true;

      if(i < length-1) {
        i++;
        $scope.likes = 20;
        $scope.imgurl = houses[i].img;
        $scope.bedRmNum =houses[i].bedRmNum;
        $scope.bathRmNum = houses[i].bathRmNum;
        $scope.houseType = houses[i].houseType;
        $scope.houseSize = houses[i].size;
        $scope.lotSize = houses[i].landSize;
        $scope.stories = houses[i].stories;
        $scope.orientation = houses[i].orientation;
        $scope.parking = houses[i].parkingNum > 0? 'Yes' : 'No';
        $scope.parkingType = houses[i].parkingType;
        $scope.outdoorSpace = houses[i].outdoorSpace;
        $scope.buildYr = 2014 - houses[i].buildYr;
        $scope.address = houses[i].address1;
        $scope.neighborhood = houses[i].neighborhood;
        $scope.city = houses[i].city;
        $scope.hideDetail = true;
        $scope.score = 88;
        $scope.scoremsg ="That was so close";
        $scope.expertvalue =689600;
        $scope.crowdvalue =695850;
      }
      else {
        i = 0;
        $scope.likes = 20;
        $scope.imgurl = houses[i].img;
        $scope.bedRmNum =houses[i].bedRmNum;
        $scope.bathRmNum = houses[i].bathRmNum;
        $scope.houseType = houses[i].houseType;
        $scope.houseSize = houses[i].size;
        $scope.lotSize = houses[i].landSize;
        $scope.stories = houses[i].stories;
        $scope.orientation = houses[i].orientation;
        $scope.parking = houses[i].parkingNum > 0? 'Yes' : 'No';
        $scope.parkingType = houses[i].parkingType;
        $scope.outdoorSpace = houses[i].outdoorSpace;
        $scope.buildYr = 2014 - houses[i].buildYr;
        $scope.address = houses[i].address1;
        $scope.neighborhood = houses[i].neighborhood;
        $scope.city = houses[i].city;
        $scope.hideDetail = true;
        $scope.score = 88;
        $scope.scoremsg ="That was so close";
        $scope.expertvalue =689600;
        $scope.crowdvalue =695850;
      }

    };
  });