starterControllers

.controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, fireBaseData, $timeout) {

  $scope.hideBackButton = true;

  $scope.user = {  };

  $scope.signIn = function (user) {
    console.log(fireBaseData.ref());
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
        console.log(authData.password.email);
        $rootScope.userLogin = 'ion-person';
        $rootScope.hide();
        $state.go('home');

      } else {
        switch (error.code) {
          case "INVALID_EMAIL":
            console.log("The specified user account email is invalid.");
            break;
          case "INVALID_PASSWORD":
            console.log("The specified user account password is incorrect.");
            break;
          case "INVALID_USER":
            console.log("The specified user account does not exist.");
            break;
          default:
            console.log("Error logging user in:", error);

        }
        $rootScope.hide();
        $rootScope.alertPopup('Error', 'Email or Password is incorrect!');
      }
    });
  };

})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $firebase, fireBaseData,$firebaseAuth) {

  $scope.hideBackButton = true;
  $scope.user = {  };

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
    auth.$createUser(email, password).then(function (error) {
      console.log("User created successfully!");
      return auth.$authWithPassword({
        email: email,
        password: password
      });
    }).then(function (authData) {

      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        created: Date.now(),
        updated: Date.now()
      }

      /* SAVE PROFILE DATA */
      var usersRef = fireBaseData.refUsers();
      var myUser = usersRef.child(escapeEmailAddress(user.email));
      console.log(myUser);
      myUser.set($scope.temp, function () {
        $rootScope.hide();
        $state.go('login');
      });

    }).catch(function (error) {
      if (error.code == 'INVALID_EMAIL') {
        $rootScope.hide();
        $rootScope.notify('Error', 'Invalid Email.');
      }
      else if (error.code == 'EMAIL_TAKEN') {
        $rootScope.hide();
        $rootScope.notify('Error', 'Email already taken.');
      }
      else {
        $rootScope.hide();
        $rootScope.notify('Error', 'Oops. Something went wrong.');
      }
    });
  };
});

function escapeEmailAddress(email) {
  if (!email)
    return false
  email = email.toLowerCase();
  email = email.replace(/\./g, ',');
  return email;
}

function unescapeEmailAddress(email) {
  if (!email)
    return false
  email = email.toLowerCase();
  email = email.replace(/\,/g, '.');
  return email;
}
