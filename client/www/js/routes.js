angular.module('starter.routes', [])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    // Each tab has its own nav history stack:

  .state('home', {
    url: '/',
    views: {
      'home': {
        templateUrl: 'view/buyer/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('addHome', {
    url: '/addHome',
    views: {
      'addHome': {
        templateUrl: 'view/seller/addhome.html',
        controller: 'AddHomeCtrl'
      }
    }
  })

  .state('addHome2', {
    url: '/addHome2',
    views: {
      'addHome2': {
        templateUrl: 'view/seller/addhome2.html',
        controller: 'AddHomeCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  //remove # from url
  //had to comment this out because ionic server does not supply html5mode. We'll need to use our custom node server to do this.
  //$locationProvider.html5Mode(true).hashPrefix('!');

})