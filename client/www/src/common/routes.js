angular.module('starter.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    // Each tab has its own nav history stack:

  .state('home', {
    url: '/home',
    templateUrl: 'src/display-home/home.html',
    controller: 'HomeCtrl'
  })
  .state('home.display', {
    url: '/:id',
    //templateUrl: 'src/display-home/display.html',
    controller: function($scope, $stateParams) {
        console.log('home id ' + $stateParams.id);
    },
    //reloadOnSearch: false
  })
  .state('login', {
    url: '/login',
    templateUrl: 'src/auth/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'src/auth/register.html',
    controller: 'RegisterCtrl'
  })

  .state('addHome', {
    url: '/addHome',
    templateUrl: 'src/add-home/addhome.html',
    controller: 'AddHomeCtrl'
   })

   .state('addHome.addHome1', {
     url: '/addHome1',
     templateUrl: 'src/add-home/addhome1.html'
      })

  .state('addHome.addHome2', {
    url: '/addHome2',
    templateUrl: 'src/add-home/addhome2.html'
  })
      
  .state('addHome.addHome3', {
    url: '/addHome3',
    templateUrl: 'src/add-home/addhome3.html'
  })
   .state('addHome.addHome4', {
    url: '/addHome4',
    templateUrl: 'src/add-home/addhome4.html'
   })
  .state('search', {
    url: '/search',
    templateUrl: 'src/search/search.html',
    controller: 'SearchCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  //remove # from url
  //had to comment this out because ionic server does not supply html5mode. We'll need to use our custom node server to do this.
  //$locationProvider.html5Mode(true).hashPrefix('!');

});