starterControllers

.controller('HeaderCtrl', function ($scope, $rootScope, fireBaseData) {
  //authentication
  $rootScope.authData = fireBaseData.ref().getAuth();
  $rootScope.getUserDisplayName = function () {
    if ($rootScope.authData === null) {
      return null;
    }
    if ($rootScope.authData.provider === 'google') {
      return $rootScope.authData.google.displayName.split(' ')[0];
    }
    if ($rootScope.authData.provider === 'facebook') {
      return $rootScope.userDisplayName = $rootScope.authData.facebook.displayName.split(' ')[0];
    }
    if ($rootScope.authData.provider === 'twitter') {
      return $rootScope.authData.twitter.displayName.split(' ')[0];
    }
    if ($rootScope.authData.provider === 'password') {
      return $rootScope.authData.user.firstname;
    }
  };

  //console.log($rootScope.authData);
});

