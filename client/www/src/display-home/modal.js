starterControllers

.controller('ModalCtrl', function ($scope,$rootScope, $mdDialog, valuation, fireBaseData,houseId) {
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
});