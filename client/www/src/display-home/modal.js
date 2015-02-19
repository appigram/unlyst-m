starterControllers

.controller('ModalCtrl', function ($scope,$rootScope, $mdDialog, valuation, fireBaseData,houseId,$interval) {
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.showWantToBuy = false;
  $scope.wanttobuy = function () {
    $scope.showWantToBuy = true;
    if ($rootScope.authData) {
      fireBaseData.likesHome($rootScope.authData, houseId);
    }
  };
  $scope.valuation = valuation;
  $scope.valuation.previousBumpValue = $scope.valuation.bumpvalue + $scope.valuation.bumpChange;
  var tick = $scope.valuation.bumpChange/100;
  console.log(tick);
  $scope.valuation.countUp = 0;
  $interval(function(){
    $scope.valuation.countUp = $scope.valuation.countUp + tick;
  },10,100);
});