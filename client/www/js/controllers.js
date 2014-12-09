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
        "img": ["img/homes/1_Market_Street _625/MarketWharf-1bed-living-room.jpg","img/homes/1_Market_Street _625/Floor-plan.jpg",
                "img/homes/1_Market_Street _625/MW-1BED-bath.jpg", "img/homes/1_Market_Street _625/MW-1bed-bed.jpg",
                "img/homes/1_Market_Street _625/MW-1bed-kitchen1.jpg", "img/homes/1_Market_Street _625/MW-1bed-kitchen2.jpg",
                "img/homes/1_Market_Street _625/MW-1bed-main.jpg", "img/homes/1_Market_Street _625/MW-1bed-main2.jpg",
                "img/homes/1_Market_Street _625/MW-1BED-MAIN3.jpg", "img/homes/1_Market_Street _625/urbantoronto-7363-25184.jpg"],
        "expertvalue":429000,
        "crowdvalue":429000
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
        "scoremsg": "That was so close",
        "expertvalue":620000,
        "crowdvalue":620000
      },
      {
        "houseId " : 3,
        "address1" : "103 - 100 Western Battery Road",
        "city": "Toronto",
        "houseType" : "Condo",
        "size" : 600,
        "bedRmNum": 1,
        "bathRmNum": 1,
        "parkingNum": 1,
        "stories": 1.5,
        "additionalSpace": "",
        "parkingType": "Underground",
        "outdoorSpace": "Patio",
        "orientation": "West",
        "buildYr": 5,
        "landSize": 0,
        "maintFee": 450,
        "neighborhood" : 'Liberty Village',
        "img": ["img/homes/100_Western_Battery_Road_103/1.jpg", "img/homes/100_Western_Battery_Road_103/2.jpg",
                "img/homes/100_Western_Battery_Road_103/3.jpg", "img/homes/100_Western_Battery_Road_103/4.jpg",
                "img/homes/100_Western_Battery_Road_103/5.jpg", "img/homes/100_Western_Battery_Road_103/6.jpg",
                "img/homes/100_Western_Battery_Road_103/7.jpg", "img/homes/100_Western_Battery_Road_103/8.jpg",
                "img/homes/100_Western_Battery_Road_103/9.jpg", "img/homes/100_Western_Battery_Road_103/10.jpg",
                "img/homes/100_Western_Battery_Road_103/11.jpg"],
        "expertvalue":359000,
        "crowdvalue":359000
      },
      {
        "houseId " : 4,
        "address1" : "671 - 313 Richmond Street East",
        "city": "Toronto",
        "houseType" : "Condo",
        "size" : 900,
        "bedRmNum": 2,
        "bathRmNum": 2,
        "parkingNum": 2,
        "stories": 1,
        "additionalSpace": "Locker",
        "parkingType": "Underground",
        "outdoorSpace": "Roof Top Terrace",
        "orientation": "West and North",
        "buildYr": 5,
        "landSize": 0,
        "maintFee": 530,
        "neighborhood" : 'Old Toronto',
        "img": ["img/homes/313_Richmond_Street_East _671/1.jpg", "img/homes/313_Richmond_Street_East _671/2.jpg",
          "img/homes/313_Richmond_Street_East _671/3.jpg", "img/homes/313_Richmond_Street_East _671/4.jpg",
          "img/homes/313_Richmond_Street_East _671/5.jpg", "img/homes/313_Richmond_Street_East _671/6.jpg",
          "img/homes/313_Richmond_Street_East _671/7.jpg", "img/homes/313_Richmond_Street_East _671/8.jpg",
          "img/homes/313_Richmond_Street_East _671/9.jpg", "img/homes/313_Richmond_Street_East _671/10.jpg",
          "img/homes/313_Richmond_Street_East _671/11.jpg"],
        "expertvalue":359000,
        "crowdvalue":359000
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
    $scope.parking = houses[i].parkingNum;
    $scope.parkingType = houses[i].parkingType;
    $scope.outdoorSpace = houses[i].outdoorSpace;
    $scope.buildYr = 2014 - houses[i].buildYr;
    $scope.address = houses[i].address1;
    $scope.neighborhood = houses[i].neighborhood;
    $scope.city = houses[i].city;
    $scope.hideDetail = true;
    $scope.expertvalue = houses[i].expertvalue;
    $scope.crowdvalue =houses[i].crowdvalue;


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
      scope: $scope
      // The animation we want to use for the modal entrance
      //animation: 'slide-in-up'
    });
    $scope.submitScore = function(){
      $scope.score = 10 - Math.abs(($scope.crowdvalue- $scope.home.valuation)/$scope.crowdvalue*10);
      if($scope.score<0){
        $scope.score = 0;
      }
      $scope.totalScore += $scope.score;
      $scope.playCount++;
      $scope.avgScore = $scope.totalScore/$scope.playCount;

    };

    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
    $scope.activeSlide = 3;
    $ionicSlideBoxDelegate.update();

    // Called each time the slide changes
    $scope.slideHasChanged = function(index) {
      $scope.activeSlide = index;
      $ionicSlideBoxDelegate.update();
    };

    $scope.slideToIndex = function(index){
      $ionicSlideBoxDelegate.slide(index);
      $ionicSlideBoxDelegate.update();
    };
    $scope.$on('modal.hidden', function() {
      $scope.clickNext();
    });

    $scope.clickNext = function() {
      setTimeout(function(){
        $ionicSlideBoxDelegate.slide(3);
        $ionicSlideBoxDelegate.update();
      },200);
      var length = houses.length;
      $scope.hideDetail = true;
      //prevent the next score to be shown

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
          $scope.parking = houses[i].parkingNum;
          $scope.parkingType = houses[i].parkingType;
          $scope.outdoorSpace = houses[i].outdoorSpace;
          $scope.buildYr = 2014 - houses[i].buildYr;
          $scope.address = houses[i].address1;
          $scope.neighborhood = houses[i].neighborhood;
          $scope.city = houses[i].city;
          $scope.hideDetail = true;
          $scope.score = 88;
          $scope.scoremsg ="That was so close";
          $scope.expertvalue = houses[i].expertvalue;
          $scope.crowdvalue =houses[i].crowdvalue;
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
          $scope.parking = houses[i].parkingNum;
          $scope.parkingType = houses[i].parkingType;
          $scope.outdoorSpace = houses[i].outdoorSpace;
          $scope.buildYr = 2014 - houses[i].buildYr;
          $scope.address = houses[i].address1;
          $scope.neighborhood = houses[i].neighborhood;
          $scope.city = houses[i].city;
          $scope.hideDetail = true;
          $scope.score = 88;
          $scope.scoremsg ="That was so close";
          $scope.expertvalue = houses[i].expertvalue;
          $scope.crowdvalue =houses[i].crowdvalue;
        }

    };
  });