angular.module('starter.directives', [])

.directive('homeList', function () {
  return {
    restrict:'E',
    scope: {
      homes: '='
    },
    templateUrl:'src/display-home/list-view/home-list.html'
  };
})