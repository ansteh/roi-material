(function(angular) {

  var app = angular.module('app', ['ngMaterial']);

  app.factory('Request', function($http) {
    function get(url){
      return new Promise(function(resolve, reject){
        $http({ method: 'GET', url: url })
        .then(function (response) {
          resolve(response.data);
        }, function (err) {
          reject(err);
        });
      });
    };

    return {
      get: get
    };
  });

  app.factory('Quandl', function(Request) {
    var createWikiUrl = _.template('https://www.quandl.com/api/v3/datasets/WIKI/${ name }.json');

    function get(name) {
      var url = createWikiUrl({ name: _.toUpper(name) });
      return Request.get(url);
    };

    return {
      get: get
    };
  });

  app.directive('test', function(Quandl){
    return {
      restrict: 'E',
      template: '<pre>{{ data | json }}</pre>',
      scope: { name: "=" },
      controller: function($scope, $element){
        $scope.data;

        Quandl.get('fb')
        .then(function(response) {
          console.log(response);
          $scope.data = response;
          $scope.$apply();
        })
        .catch(function(err) {
          console.log(err);
        });

      }
    };
  });

  console.log('test');
}(angular));
