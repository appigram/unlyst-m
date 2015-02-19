starterControllers

.controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, fireBaseData, $timeout,$http) {
  var updateAuth = function () {
    var authData = fireBaseData.ref().getAuth();
    if (authData && authData.provider !== 'anonymous') {
      var ref = fireBaseData.refUsers().child(authData.uid);
      ref.on("value", function (snap) {
        $rootScope.authData = snap.val();
        $rootScope.authData.userDisplayName = fireBaseData.getUserDisplayName($rootScope.authData);
        $rootScope.authData.userProfilePicture = fireBaseData.getUserProfilePicture($rootScope.authData);
      });
    }
  };

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
  $scope.hideBackButton = true;

  $rootScope.user = {};
  $rootScope.user.username = $scope.user.username;
  $rootScope.user.password = $scope.user.password;
  $rootScope.EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
  function onLoginSuccess(authData) {
    saveUserProfile(authData);
    $scope.$broadcast('updateauth');
    $state.go('home');
  }

  function saveUserProfile(authData) {
    authData.updated = Firebase.ServerValue.TIMESTAMP;
    /* SAVE PROFILE DATA */
    var usersRef = fireBaseData.refUsers();
    $http.get('http://ipinfo.io/json').
    success(function (data) {
      authData.geo = data;
      //use uid as ID, if the user logs in again, we simply update the profile instead of creating a new one
      usersRef.child(authData.uid).update(authData);
    }).
    error(function (err) {
      usersRef.child(authData.uid).update(authData);
    });
  };

  $scope.signIn = function (user, validForm) {
    $scope.submitted = true;
    if (!validForm) {
      return;
    }
    $rootScope.show('Logging In...');

    /* Check user fields*/
    if (!user || !user.email || !user.password) {
      $rootScope.notify('Error', 'Email or Password is incorrect!');
      return;
    }

    /* All good, let's authentify */
    fireBaseData.ref().authWithPassword({
      email: user.email,
      password: user.password
    }, function (error, authData) {
      if (error === null) {
        onLoginSuccess(authData);
      } else {
        switch (error.code) {
          case "INVALID_EMAIL":
            $rootScope.notify("The specified user account email is invalid.");
            break;
          case "INVALID_PASSWORD":
            $rootScope.notify("The specified user account password is incorrect.");
            break;
          case "INVALID_USER":
            $rootScope.notify("The specified user account does not exist.");
            break;
          default:
            $rootScope.notify("Error logging user in:", error);
        }
      }
      $timeout(function () {
        $rootScope.hide();
      }, 100);
    });
  };
  var socialAuthRedirect = function (provider, dataScope) {
    var scope = {scope: dataScope};
    fireBaseData.ref().authWithOAuthRedirect(provider, function (error, authData) {
      if (error) {
        $rootScope.notify("Login Failed!", error);
      }
      else {
        onLoginSuccess(authData);
      }
    }, scope);
  };

  var socialAuth = function (provider, dataScope) {
    var scope = {scope: dataScope};
    fireBaseData.ref().authWithOAuthPopup(provider, function (error, authData) {
      if (error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          // fall-back to browser redirects, and pick up the session
          // automatically when we come back to the origin page
          socialAuthRedirect(provider, dataScope);
        } else {
          $rootScope.notify("Login Failed!", error);
        }
      } else {
        onLoginSuccess(authData);
      }
    }, scope);
  };

  $scope.facebookLogin = function () {
    var dataScope = "email,public_profile,user_games_activity,user_location";
    var provider = "facebook";
    socialAuth(provider, dataScope);
  };

  $scope.googleLogin = function () {
    var dataScope = "email,profile";
    var provider = "google";
    socialAuth(provider, dataScope);
  };
  $scope.twitterLogin = function () {

    var provider = "twitter";
    socialAuth(provider, null);
  };

})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $firebase, fireBaseData, $firebaseAuth, $http) {

  $scope.hideBackButton = true;

  $scope.createUser = function (user, valid) {
    $scope.submitted = true;
    if (!valid) {
      return;
    }
    var firstname = user.firstname;
    var surname = user.surname;
    var email = user.email;
    var password = user.password;

    if (!firstname || !surname || !email || !password) {
      $rootScope.notify("Please enter valid credentials");
      return false;
    }
    $rootScope.show('Registering...');

    var auth = $firebaseAuth(fireBaseData.ref());
    var saveUserProfile = function (authData) {
      authData.updated = Firebase.ServerValue.TIMESTAMP;
      var temp = {};
      temp.firstname = user.firstname;
      temp.lastname = user.surname;
      authData.user = temp;
      /* SAVE PROFILE DATA */
      var usersRef = fireBaseData.refUsers();
      usersRef.child(authData.uid).set(authData, function () {
        $rootScope.hide();
        $state.go('login');
        $rootScope.notify('Enter your email and password to login. ');
      });
    };
    var sendEmail = function () {
      var req = {
        url: '/sendmail',
        method: 'POST',
        data: {'email': email},
        headers: {'Content-Type': 'application/json'}
      };
      $http(req).success(function (res) {
        if (res && res[0].status == 'sent') {
          console.log('email sent to ' + res[0].email);
        } else {
          console.log('email not sent');
        }
      }).error(function (err) {
        console.log(err);
      });
    }
    auth.$createUser(email, password).then(function (error) {
      return auth.$authWithPassword({
        email: email,
        password: password
      });
    })
    .then(saveUserProfile)
    .then(sendEmail)
    .catch(function (error) {
      $rootScope.hide();
      if (error.code == 'INVALID_EMAIL') {

        $rootScope.notify('Error', 'Invalid Email.');
      }
      else if (error.code == 'EMAIL_TAKEN') {
        $rootScope.notify('Error', 'Email already taken.');
      }
      else {
        $rootScope.notify('Error', 'Oops. Something went wrong.');
      }
    });
  };
});
