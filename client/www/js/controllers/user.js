starterControllers

.controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, fireBaseData, $timeout) {

  $scope.hideBackButton = true;

  $rootScope.user = {};
  $rootScope.user.username = $scope.user.username;
  $rootScope.user.password = $scope.user.password;

  function onLoginSuccess(authData) {
    saveUserProfile(authData);
    $rootScope.notify("Authenticated successfully!");
    $rootScope.userLogin = 'ion-person';
    $rootScope.userid = authData.id;
    $rootScope.hide();
    $state.go('home');
  }

  function saveUserProfile(authData) {
    authData.updated = Firebase.ServerValue.TIMESTAMP;
    /* SAVE PROFILE DATA */
    var usersRef = fireBaseData.refUsers();
    usersRef.child(authData.uid).set(authData);
    //usersRef.child(authData.uid).once('value', function (snapshot){
    //  if(snapshot.val() === null){
    //    usersRef.child(authData.uid).set(authData);
    //  }
    //});
  };
  //TODO: make sure users cannot log in again after already logged in. only log out.
  var authenticated = fireBaseData.ref().getAuth();
  console.log(authenticated);

  $scope.signIn = function (user) {
    $rootScope.show('Logging In...');

    /* Check user fields*/
    if (!user || !user.email || !user.password) {
      $rootScope.alertPopup('Error', 'Email or Password is incorrect!');
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
        $rootScope.alertPopup('Error', 'Email or Password is incorrect!');
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
  /* LOGOUT BUTTON */
  $scope.logout = function () {
    $ionicHistory.clearCache();
    fireBaseData.ref().unauth();
    $rootScope.checkSession();
    $rootScope.notify("Logged out successfully!");
  };

  $rootScope.checkSession = function () {
    $rootScope.authData = fireBaseData.ref().getAuth();
    if ($rootScope.authData) {
      $rootScope.hide();
      $state.go('home');

    } else {
      $rootScope.hide();
      $state.go('login');
    }
  };
})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $firebase, fireBaseData, $firebaseAuth) {
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
      /* SAVE PROFILE DATA */
      var usersRef = fireBaseData.refUsers();
      usersRef.child(authData.uid).set(authData, function() {
        $rootScope.hide();
        $state.go('login')
        $rootScope.notify('Enter your email and password to login. ');;
      });
    };
    auth.$createUser(email, password).then(function (error) {
      return auth.$authWithPassword({
        email: email,
        password: password
      });
    })
    .then(saveUserProfile)
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
