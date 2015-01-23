starterControllers
.controller('HeaderCtrl', function ($scope, $rootScope, fireBaseData, $ionicPopover, $ionicHistory, $state, $mdSidenav) {
  //authentication
  $rootScope.authData = fireBaseData.ref().getAuth();

  $rootScope.getUserDisplayName = function (full) {
    var name;
    if ($rootScope.authData === null) {
      return null;
    }
    else if ($rootScope.authData.provider === 'google') {
      name = $rootScope.authData.google.displayName;
    }
    else if ($rootScope.authData.provider === 'facebook') {
      name = $rootScope.userDisplayName = $rootScope.authData.facebook.displayName;
    }
    else if ($rootScope.authData.provider === 'twitter') {
      name = $rootScope.authData.twitter.displayName;
    }
    else if ($rootScope.authData.provider === 'password') {
      if ($rootScope.authData.user == null) {
        return '';
      }
      name = $rootScope.authData.user.firstname + ' ' + $rootScope.authData.user.lastname;
    }
    if (full) {
      return name;
    } else {
      return name.split(' ')[0]
    }
  };

  $rootScope.getUserProfilePicture = function () {
    if ($rootScope.authData === null) {
      return null;
    }
    else if ($rootScope.authData.provider === 'google') {
      return $rootScope.authData.google.cachedUserProfile.picture;
    }
    else if ($rootScope.authData.provider === 'facebook') {
      return $rootScope.authData.facebook.cachedUserProfile.picture.data.url;
    }
    else if ($rootScope.authData.provider === 'twitter') {
      return $rootScope.authData.twitter.cachedUserProfile.profile_image_url;
    }
    else if ($rootScope.authData.provider === 'password') {
      return null;
    }
  };

  $rootScope.getReputationIcon = function () {
    var number = Math.round($rootScope.authData.reputation);
    if (number < 10) {
      number = '0' + number;
    }
    return 'http://google-maps-icons.googlecode.com/files/red' + number + '.png'
  };

  $ionicPopover.fromTemplateUrl('src/auth/popover.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.popover = popover;
  });
  /* LOGOUT BUTTON */
  $rootScope.logout = function () {
    $ionicHistory.clearCache();
    fireBaseData.ref().unauth();
    $scope.checkSession();
    $rootScope.notify("Logged out successfully!");
    $scope.popover.hide();
  };

  $scope.checkSession = function () {
    $rootScope.authData = fireBaseData.ref().getAuth();
    $rootScope.hide();
    $state.go('home');

  };
  $scope.toggleLeftMenu = function () {
    $mdSidenav('left').toggle();
  };
});

