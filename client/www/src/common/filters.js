angular.module('starter.filters',[])

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

.filter('scoreMessage', [function () {
  return function (score) {
    var scoreMsg = [
      'Sorry, we can’t count that estimate', //0
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
    var scoreAdjusted = Math.round(score/10);
    return scoreMsg[scoreAdjusted];
  }
}]);