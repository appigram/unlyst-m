starterControllers

.controller('ModalCtrl', function ($scope, $mdDialog, valuation) {
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.valuation = valuation;

})