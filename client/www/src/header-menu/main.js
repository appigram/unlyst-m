starterControllers
.controller('MainCtrl', function ($scope, $rootScope, fireBaseData, $ionicPopover, $ionicHistory, $state, $mdSidenav, $http) {
  var updateAuth = function () {
    var authData = fireBaseData.ref().getAuth();
    if (authData && authData.provider !== 'anonymous') {
      var ref = fireBaseData.refUsers().child(authData.uid);
      ref.on("value", function (snap) {
        $rootScope.authData = snap.val();
        $rootScope.authData.userDisplayName = fireBaseData.getUserDisplayName($rootScope.authData);
        $rootScope.authData.userProfilePicture = fireBaseData.getUserProfilePicture($rootScope.authData);
      });
    } else if (authData && authData.provider === 'anonymous') {
      var ref = fireBaseData.refUsers().child(authData.uid);
      ref.on("value", function (snap) {
        if (!snap.val()) {
          //authAnonymously();
          return;
        }
        $rootScope.anonymousAuth = snap.val();
      });
    } else if (!authData) {
      authAnonymously();
    }
  };
  var authAnonymously = function () {
    fireBaseData.ref().authAnonymously(function (error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        authData.updated = Firebase.ServerValue.TIMESTAMP;
        authData.geo = {};
        $http.get('http://ipinfo.io/json').
        success(function (data) {
          authData.geo = data;
          fireBaseData.refUsers().child(authData.uid).update(authData);
        }).
        error(function () {
          fireBaseData.refUsers().child(authData.uid).update(authData);
        });
      }
    });
  }
  $scope.$on('updateauth', function () {
    updateAuth();
  });
  fireBaseData.ref().onAuth(function () {
    updateAuth();
  });

  $rootScope.getReputationIcon = function () {
    var number = Math.round($rootScope.authData.reputation);
    if (number < 10) {
      number = '0' + number;
    }
    return 'http://google-maps-icons.googlecode.com/files/red' + number + '.png'
  };

  /* LOGOUT BUTTON */
  $rootScope.logout = function () {
    $ionicHistory.clearCache();
    fireBaseData.ref().unauth();
    $scope.checkSession();
    $rootScope.notify("Logged out successfully!");
    $scope.popover.hide();
    $state.go('login');
  };

  $scope.checkSession = function () {
    $rootScope.authData = fireBaseData.ref().getAuth();
    $rootScope.hide();

  };
  $scope.toggleLeftMenu = function () {
    $mdSidenav('left').toggle();
  };
  $ionicPopover.fromTemplateUrl('src/auth/popover.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.popover = popover;
  });
});

