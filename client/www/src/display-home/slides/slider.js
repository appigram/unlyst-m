starterControllers

.controller('SliderCtrl', function ($scope, $rootScope, $ionicSlideBoxDelegate,$timeout) {
  $scope.activeSlide = 0;
  var infoSlideNum = 4;
  $scope.infoNum = infoSlideNum;
  $scope.next = function () {
    $ionicSlideBoxDelegate.next();

  };
  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };

  var updateTabs = function () {
    numSlides = $ionicSlideBoxDelegate.count();

    $scope.curPhotoSlide = $scope.curInfoSlide = '';
    if (isPhotoSlide()) {
      var curSlide = $scope.activeSlide + 1;
      $scope.curPhotoSlide = curSlide + '/' + $scope.property.img.length;
    }
    else if (isInfoSlide()) {
      var curSlide = $scope.activeSlide - $scope.property.img.length + 1;
      $scope.curInfoSlide = curSlide + '/' + infoSlideNum;
    }
  };

  $rootScope.analytics = {};
  $rootScope.analytics.slideIndex = [];
  $rootScope.analytics.tabInex = [];

  // Called each time the slide changes
  $scope.slideHasChanged = function (index) {
    $scope.activeSlide = index;
    updateTabs();
    $rootScope.analytics.slideIndex.push(index);
    $rootScope.analytics.tabInex.push($scope.activeTab());
  };

  $scope.changeSlide = function(index) {
    $scope.activeSlide = index;
    $ionicSlideBoxDelegate.slide(index);
  };

  $scope.activeTab = function() {
    if (isPhotoSlide()) {
      return 0
    } else if(isInfoSlide()) {
      return 1
    } else if(isMapSlide()){
      return 2;
    }
    return 0;
  };
  var numSlides = $ionicSlideBoxDelegate.count();
  $scope.curPhotoSlide = $scope.curInfoSlide = '';

  var isPhotoSlide = function () {
    return $scope.activeSlide < numSlides - infoSlideNum - 1;
  };
  var isInfoSlide = function () {
    return $scope.activeSlide < numSlides - 1
    && $scope.activeSlide >= numSlides - infoSlideNum - 1;
  };
  var isMapSlide = function () {
    return $scope.activeSlide === numSlides-1;
  };
  $scope.$on('updateTabs', function() {
    $timeout(function () {
      updateTabs();
    }, 100);
  });

});