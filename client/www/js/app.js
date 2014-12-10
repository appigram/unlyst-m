// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'leaflet-directive'])

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

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/home',
        views: {
          'tab-dash': {
            templateUrl: 'templates/home.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.friends', {
        url: '/friends',
        views: {
          'tab-friends': {
            templateUrl: 'templates/tab-friends.html',
            controller: 'FriendsCtrl'
          }
        }
      })
      .state('tab.friend-detail', {
        url: '/friend/:friendId',
        views: {
          'tab-friends': {
            templateUrl: 'templates/friend-detail.html',
            controller: 'FriendDetailCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

  })
  .directive('noScroll', function ($document) {

    return {
      restrict: 'A',
      link: function ($scope, $element, $attr) {

        $document.on('touchmove', function (e) {
          e.preventDefault();
        });
      }
    }
  })
  // interceptor for http request. Show loading icon.
  //.config(function ($httpProvider) {
  //  $httpProvider.interceptors.push(function ($rootScope) {
  //    return {
  //      request: function (config) {
  //        $rootScope.$broadcast('loading:show')
  //        return config
  //      },
  //      response: function (response) {
  //        $rootScope.$broadcast('loading:hide')
  //        return response
  //      }
  //    }
  //  })
  //})
  //
  //.run(function ($rootScope, $ionicLoading) {
  //  $rootScope.$on('loading:show', function () {
  //    $ionicLoading.show({template: 'foo'})
  //  })
  //
  //  $rootScope.$on('loading:hide', function () {
  //    $ionicLoading.hide()
  //  })
  //})
  .filter('noFractionCurrency',
  ['$filter', '$locale',
    function (filter, locale) {
      var currencyFilter = filter('currency');
      var formats = locale.NUMBER_FORMATS;
      return function (amount, currencySymbol) {
        var value = currencyFilter(amount, currencySymbol);
        var sep = value.indexOf(formats.DECIMAL_SEP);
        if (amount >= 0) {
          return value.substring(0, sep);
        }
        return value.substring(0, sep) + ')';
      };
    }])
  .filter('scoreMessage',
  ['$filter',
    function (score) {
      var scoreAdjusted = Math.round(score);
      var scoreMsg = ['Sorry, we can’t count that estimate', //0
        'Are you even trying?',
        'Yikes, you’re way off',
        'Think of this as a learning round', //3
        'Don’t get out much?',
        'You’ve got it in you!',
        'Okay, you’re getting the hang of this',//5
        'A solid valuation',
        'You’re a star',
        'That was so close!',//9
        'Nailed it!'];
      return scoreMsg[scoreAdjusted - 1];
    }
  ]);
