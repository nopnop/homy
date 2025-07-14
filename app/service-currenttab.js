;(function () {
  var app = angular.module('service-currenttab', ['service-storage']);

  app.factory('currentTab', ['$q', 'homyStorage', function ($q, homyStorage) {
    return {
      getCurrentLink: function () {
        var d = $q.defer();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs && tabs[0]) {
            d.resolve(homyStorage.getLinkFor(tabs[0].url, tabs[0].title));
          } else {
            d.reject('No active tab found');
          }
        });
        return d.promise;
      }
    }
  }]);
})();
