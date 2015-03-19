starterControllers

.controller('ChartCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  //high charts
  var valuations = [];
  $scope.$on('updateChart', function () {
    angular.forEach($rootScope.singlehome.valuations, function (value, key) {
      valuations.push([
        value.created, // the date
        value.homeValue // close
      ]);
    });
    // set the allowed units for data grouping
    var groupingUnits = [[
      'day',                         // unit name
      [1]                             // allowed multiples
    ], [
      'month',
      [1, 2, 3, 4, 6]
    ]];

    $scope.highchartsNG = {
      options: {
        chart: {
          type: 'StockChart'
        },
        navigator: {enabled: false}
      },
      useHighStocks: true,
      rangeSelector: {
        inputEnabled: true,
        selected: 1
      },
      title: {
        text: 'Historic Unlyst Value'
      },

      yAxis: [{
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Valuation'
        },
        lineWidth: 2
      }],

      series: [{
        type: 'spline',
        name: 'Unlyst value',
        data: valuations,
        dataGrouping: {
          units: groupingUnits
        }
      }],
      exporting:{
        enabled:true
      }
    };
  });
}])