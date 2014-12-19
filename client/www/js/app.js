// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic','starter.routes', 'starter.controllers', 'starter.services', 'starter.filters',
  'starter.directives', 'ui.router', 'firebase', 'leaflet-directive', 'xeditable'])
var starterControllers = angular.module('starter.controllers', []);

starter
//interceptor for http request. Show loading icon.
.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
      request: function (config) {
        $rootScope.$broadcast('loading:show');
        return config;
      },
      response: function (response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      }
    }
  })
})

.run(function ($rootScope, $ionicLoading) {
  $rootScope.$on('loading:show', function () {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  });

  $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide();
  });

  $rootScope.show = function (text) {
    $rootScope.loading = $ionicLoading.show({
      template: '<i class="icon ion-looping"></i><br>' + text,
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  };
})

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
//
//.config(function($stateProvider, $urlRouterProvider) {
//
//  $stateProvider
//  .state('signin', {
//    url: '/sign-in',
//    templateUrl: 'view/user/login.html',
//    controller: 'HomeCtrl'
//  })
//
//  $urlRouterProvider.otherwise('/sign-in');
//
//})

