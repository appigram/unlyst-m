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
  .controller('HomeCtrl', function($scope, $ionicModal) {

    $scope.valuation = 400000;
    // Load the modal from the given template URL
    // somehow need to move ionicmodal first

    var TYPE = ['CONDO', 'DETACHED', 'SEMEI-DETACHED'];
    var i = 0;
    $scope.test = $scope.data;
    var houses = [
      {
        "houseId " : 1,
        "address1" : "1102 College Street",
        "houseType" : "House",
        "size" : 1000,
        "bedRmNum": 1,
        "bathRmNum": 2,
        "parkingNum": 1,
        "buildYr": 5,
        "landSize": 0,
        "maintFee": 100,
        "img": ["img/homes/house1_1.jpg","img/homes/house1_2.jpg","img/homes/house1_3.jpg", "img/homes/house1_4.jpg"],
        "score": 88,
        "scoremsg": "That was so close",
        "expertvalue":689600,
        "crowdvalue":695850
      },
      {
        "houseId " : 2,
        "address1" : "128 Bloor Street",
        "houseType" : "Semi",
        "size" : 2000,
        "bedRmNum": 2,
        "bathRmNum": 2,
        "parkingNum": 1,
        "buildYr": 5,
        "landSize": 1230,
        "maintFee": null,
        "img": ["img/homes/house2_1.jpg","img/homes/house2_2.jpg","img/homes/house2_3.jpg", "img/homes/house1_1.jpg"],
        "score": 48,
        "scoremsg": "Come on be more serious",
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
    $scope.parking = houses[i].parkingNum > 0? 'Yes' : 'No';
    $scope.buildYr = 2014 - houses[i].buildYr;
    $scope.address = houses[i].address1;
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
      $scope.score = ($scope.crowdvalue- $scope.home.valuation)/$scope.crowdvalue*10;
      $scope.totalScore += $scope.score;
      $scope.playCount++;
      console.log('score:'+ $scope.score);
      console.log('playcount:'+ $scope.playCount);
      $scope.avgScore = $scope.score;
    };


    $scope.clickNext = function() {
      var length = houses.length;
      $scope.hideDetail = true;

      if(i < length-1) {
        i++;
        $scope.bedRmNum =houses[i].bedRmNum;
        $scope.bathRmNum = houses[i].bathRmNum;
        $scope.houseType = houses[i].houseType;
        $scope.houseSize = houses[i].size;
        $scope.lotSize = houses[i].landSize;
        $scope.parking = houses[i].parkingNum > 0? 'Yes' : 'No';
        $scope.buildYr = 2014 - houses[i].buildYr;
        $scope.address = houses[i].address1;
        $scope.score = houses[i].score;
        $scope.imgurl = houses[i].img;
        $scope.scoremsg = houses[i].scoremsg;
        $scope.expertvalue = houses[i].expertvalue;
        $scope.crowdvalue = houses[i].crowdvalue;
      }
      else {
        i = 0;
        $scope.bedRmNum = houses[i].bedRmNum;
        $scope.bathRmNum = houses[i].bathRmNum;
        $scope.houseType = houses[i].houseType;
        $scope.houseSize = houses[i].size;
        $scope.lotSize = houses[i].landSize;
        $scope.parking = houses[i].parkingNum > 0? 'Yes' : 'No';
        $scope.buildYr = 2014 - houses[i].buildYr;
        $scope.address = houses[i].address1;
        $scope.score = houses[i].score;
        $scope.imgurl = houses[i].img;
        $scope.scoremsg = houses[i].scoremsg;
        $scope.expertvalue = houses[i].expertvalue;
        $scope.crowdvalue = houses[i].crowdvalue;
      }

    };
  });