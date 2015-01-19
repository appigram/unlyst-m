starterControllers

.controller('SliderCtrl', function ($scope,$rootScope, $ionicSlideBoxDelegate) {
  $scope.activeSlide = 0;
  $scope.next = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };

  $ionicSlideBoxDelegate.update();

  var updateTabs =function () {
    numSlides = $ionicSlideBoxDelegate.count();
    $scope.curPhotoSlide = $scope.curInfoSlide = '';
    if (isPhotoSlide()) {
      var curSlide = $scope.activeSlide + 1;
      $scope.curPhotoSlide = curSlide + '/' + $scope.property.img.length;
    }
    else if (isInfoSlide()) {
      var curSlide = $scope.activeSlide - $scope.property.img.length + 1;
      $scope.curInfoSlide = curSlide + '/' + 3;
    }
  };

  // Called each time the slide changes
  $scope.slideHasChanged = function (index) {
    $ionicSlideBoxDelegate.slide(index);
    $scope.activeSlide = index;
    $ionicSlideBoxDelegate.update();
    updateTabs();
  };

  //for tabs showing correctly
  var numSlides = 0;
  $scope.curPhotoSlide = $scope.curInfoSlide = '';


  var isPhotoSlide = function () {
    return $scope.activeSlide < numSlides - 3 - 1;
  }
  var isInfoSlide = function () {
    return $scope.activeSlide < numSlides - 1
    && $scope.activeSlide >= numSlides - 3 - 1;
  }

});