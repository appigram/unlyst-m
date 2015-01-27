starterControllers

.controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, fireBaseData, $timeout) {

  $scope.hideBackButton = true;

  $rootScope.user = {};
  $rootScope.user.username = $scope.user.username;
  $rootScope.user.password = $scope.user.password;

  function onLoginSuccess(authData) {
    saveUserProfile(authData);
    $scope.$broadcast('updateAuth');
    $state.go('home');
    $scope.$apply();
  }
  function saveUserProfile(authData) {
    authData.updated = Firebase.ServerValue.TIMESTAMP;
    /* SAVE PROFILE DATA */
    var usersRef = fireBaseData.refUsers();
    //use uid as ID, if the user logs in again, we simply update the profile instead of creating a new one
    usersRef.child(authData.uid).update(authData);
  };

  $scope.signIn = function (user) {
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
        $rootScope.hide();
        $rootScope.notify('Error', 'Email or Password is incorrect!');
      }
    });
  };

  $scope.facebookLogin = function () {

    fireBaseData.ref().authWithOAuthPopup("facebook", function (error, authData) {
      if (error) {
        $rootScope.notify("Login Failed!", error);
      } else {
        onLoginSuccess(authData);
      }
    }, {
      scope: "email,public_profile,user_games_activity,user_location"
    });
  };

  $scope.googleLogin = function () {
    fireBaseData.ref().authWithOAuthPopup("google", function (error, authData) {
      if (error) {
        $rootScope.notify("Login Failed!", error);
      } else {
        onLoginSuccess(authData);
      }
    }, {
      scope: "email,profile"
    });
  };
  $scope.twitterLogin = function () {
    fireBaseData.ref().authWithOAuthPopup("twitter", function (error, authData) {
      if (error) {
        $rootScope.notify("Login Failed!", error);
      } else {
        onLoginSuccess(authData);
      }
    });
  };

})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $firebase, fireBaseData, $firebaseAuth, $http) {
  $scope.hideBackButton = true;

  $scope.createUser = function (user) {
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
