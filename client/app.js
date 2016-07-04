(function(angular) {

  var Stock = function(info) {
    var series = _.chain(_.get(info, 'dataset.data', []))
      .reverse()
      .value();

    var data = _.map(series, function(point) {
      return {
        date: moment(point[0], 'YYYY-MM-DD').toDate(),
        close: point[4]
      }
    });

    var maxDiff = function() {
      var memory = {};
      var maxDiff = -1;
      var maxRight = _.last(data);
      memory.max = maxRight;
      for (var i = data.length-2; i >= 0; i--) {
        if (data[i].close > maxRight.close) {
          maxRight = data[i];
          memory.max = maxRight;
        } else {
          var diff = maxRight.close - data[i].close;
          if (diff > maxDiff) {
            memory.min = data[i];
            maxDiff = diff;
          }
        }
      }
      memory.maxDiff = maxDiff;
      return memory;
    }

    var getOptimum = function() {
      return maxDiff();
    };

    return {
      data: data,
      getOptimum: getOptimum
    };
  };

  var Graphics = {};

  Graphics.stock = function plot(anchor, stock){
    //console.log(info);


    MG.data_graphic({
      title: 'Facebook',
      data: stock.data,
      full_width: true,
      target: anchor,
      x_accessor: 'date',
      y_accessor: 'close'
    });
  };

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
      template: '<div id="stock" style="width: 100%; height-min: 100px;"></div>',
      scope: { name: "=" },
      controller: function($scope, $element){

        Quandl.get('fb')
        .then(function(response) {
          var stock = Stock(response);
          console.log(stock.getOptimum());
          Graphics.stock($element.find('#stock')[0], stock);
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
