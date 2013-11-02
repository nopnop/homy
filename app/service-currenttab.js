;(function() {


var app = angular.module('service-currenttab',['service-storage']);

app.factory('currentTab', ['$q','homyStorage', function($q, homyStorage) {
  return {
    getCurrentLink: function() {
      var d = $q.defer();
      chrome.tabs.getSelected(function(tab) {
        d.resolve(homyStorage.getLinkFor(tab.url, tab.title));
      });
      return d.promise;
    }
  }
}]);


})();

