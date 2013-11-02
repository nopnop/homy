;(function() {


var app = angular.module('addpopupApp', ['service-storage','service-currenttab']);

app.controller('EditBookmarkCtrl',['$scope','$rootScope','homyStorage', 'currentTab', function ($scope, $rootScope, homyStorage, currentTab) {

  $scope.deleted = false;

  currentTab.getCurrentLink().then(function(link) {
    $scope.link    = link;
  });

  $scope.onChange = function() {
    return homyStorage.saveLink($scope.link)
  }

  $scope.removeBookmark = function() {
    if($scope.link && $scope.link.id) {
      homyStorage.removeLink($scope.link).then(function() {
        $scope.deleted = true;
      })
    };
  }

  $scope.submit = function(event) {
    if(event.charCode !== 13) return;
    $scope.onChange().then(function() {
      $scope.close();
    });
  }

  $scope.close = function() {
    window.close();
  }
}])


})();
