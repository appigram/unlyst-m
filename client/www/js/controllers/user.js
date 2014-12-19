angular.module('starter.account', [])

.controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, fireBaseData) {

  $scope.hideBackButton = true;

  /* FOR DEV PURPOSES */
  $scope.user = {
    email: "johndoe@gmail.com",
    password: "password"
  };

  $scope.signIn = function (user) {

    $rootScope.show('Logging In...');

    /* Check user fields*/
    if(!user || !user.email || !user.password){
      $rootScope.alertPopup('Error','Email or Password is incorrect!');
      return;
    }

    /* All good, let's authentify */
    fireBaseData.ref().authWithPassword({
      email    : user.email,
      password : user.password
    }, function(error, authData) {
      if (error === null) {
        $rootScope.hide();
        $state.go('tabs.dashboard');
      } else {
        $rootScope.hide();
        $rootScope.alertPopup('Error','Email or Password is incorrect!');
      }
    });
  };

})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $firebase, fireBaseData) {
  $scope.hideBackButton = true;

  /* FOR DEV PURPOSES */
  $scope.user = {
    firstname: "John",
    surname: "Doe",
    email: "johndoe@gmail.com",
    password: "password"
  };

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
      var usersRef = fireBaseData.refRoomMates();
      var myUser = usersRef.child(escapeEmailAddress(user.email));
      myUser.set($scope.temp, function(){
        $rootScope.hide();
        $state.go('introduction');
      });

    }).catch(function (error) {
      if (error.code == 'INVALID_EMAIL') {
        $rootScope.hide();
        $rootScope.notify('Error','Invalid Email.');
      }
      else if (error.code == 'EMAIL_TAKEN') {
        $rootScope.hide();
        $rootScope.notify('Error','Email already taken.');
      }
      else {
        $rootScope.hide();
        $rootScope.notify('Error','Oops. Something went wrong.');
      }
    });
  };
})