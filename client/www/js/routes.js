angular.module('starter.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    // Each tab has its own nav history stack:

  .state('home', {
    url: '/',
    templateUrl: 'view/buyer/home.html',
    controller: 'HomeCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'view/user/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'view/user/register.html',
    controller: 'RegisterCtrl'
  })

  .state('addHome', {
    url: '/addHome',
    templateUrl: 'view/seller/addhome.html',
    controller: 'AddHomeCtrl'
   })

   .state('addHome.addHome1', {
     url: '/addHome1',
     templateUrl: 'view/seller/addhome1.html'
      })

  .state('addHome.addHome2', {
    url: '/addHome2',
    templateUrl: 'view/seller/addhome2.html'
  })
      
  .state('addHome.addHome3', {
    url: '/addHome3',
    templateUrl: 'view/seller/addhome3.html'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  //remove # from url
  //had to comment this out because ionic server does not supply html5mode. We'll need to use our custom node server to do this.
  //$locationProvider.html5Mode(true).hashPrefix('!');

});