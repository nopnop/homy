;(function() {
  var app = angular.module('homyApp',[
    'ui.sortable',
    'service-storage',
    'colorpicker.module'
  ]);


  app.controller('LinksListCtrl',['$scope','$rootScope', 'homyStorage', function ($scope, $rootScope, homyStorage) {

    var firstChange = true;


    function update() {
      $scope.links      = homyStorage.data.links;
      $scope.background = homyStorage.data.background;
    }



    var saveDebounce = debounce(function() {
       homyStorage.data.links      = $scope.links;
       homyStorage.data.background = $scope.background;
       homyStorage.save();
    },100);

    homyStorage.load().then(update).then();

    homyStorage.addChangeListener(update);

    $scope.update = update;

    $scope.backgroundUpdate = function() {
      saveDebounce();
    }


    $scope.sortableOptions = {
      placeholder: "ui-state-highlight",
      items: "li:not(.ui-state-disabled)",
      scroll: false,
      stop: function(e, ui) {
        saveDebounce();
      },
    };


    $scope.edit = function(link) {
      link.$edit       = true;
      link.$focusInput = true;
    }

    $scope.delete = function(link) {
      homyStorage.removeLink(link).then(function() {
        $scope.links = homyStorage.data.links;
      });
    }

    $scope.onSubmit = function(link) {
      link.$edit = false;
      if(!/^http/.test(link.url)) {
        link.url = "http://" + link.url;
      }
      saveDebounce();
    }

    $scope.import = function() {
      $('#importInput').trigger('click');
    }


    $('#importInput').on('change', function(event) {
      var file = this.files[0];
      if(!file) return;
      if(file.type != "application/json") {
        alert('Invalid file type: please choose a valid Homy file.');
      }
      var reader = new FileReader();
      reader.onload = function() {
        if(!confirm('This action will override you current homy configuration.')) return;
        homyStorage.import(reader.result).then(update);
      }
      reader.readAsText(file);
    })



    $scope.export = function() {
      var content = angular.toJson(homyStorage.data);
      var file    = new Blob([content], {type : "application/json;charset=UTF-8"});
      var a       = document.createElement('a');
      a.href      = ( window.webkitURL || window.URL ).createObjectURL(file);
      a.download  = 'homy_' + homyStorage.data._rev + '.json';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.parentNode.removeChild(a);
    }

  }]);

  app.controller('AddNewCtrl', ['$scope', 'homyStorage', function($scope, homyStorage) {

    function resetScope() {
      $scope.link = {
        name:'',
        url: '',
        style: {
          backgroundColor: 'rgba(0,0,0,0)'
        },
        $edit:false,
      }
    }
    resetScope();

    $scope.add = function() {
      $scope.link.$edit       = true;
      $scope.link.$focusInput = true;
    }

    $scope.undo = function() {
      resetScope();
    }

    $scope.onSubmit = function() {
      var link = $scope.link;
      if(link.url === '') return resetScope();
      if(!/^http/.test(link.url)) {
        link.url = "http://" + link.url;
      }
      homyStorage.saveLink({
        id: null,
        name: link.name,
        url: link.url,
        style: link.style
      }).then(function() {
        resetScope();
        $scope.$parent.update();
      });
    }

  }]);

  app.directive('focusMe', function() {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.focusMe, function(value) {
          if(value === true) {
            element[0].focus();
            scope[attrs.focusMe] = false;
          }
        });
      }
    };
  });

  app.directive('bookmarkEditor', function() {
    return {
      restrict: 'E',
      scope: {
        bookmark:'=bookmark',
        onSubmit:'&onSubmit'
      },
      templateUrl: '/app/views/partials/bookmark-editor.html',
      link: function($scope) {
        $scope.keypress = function($event) {
          if(event.charCode !== 13) return;
          if($scope.onSubmit) $scope.onSubmit();
        }
      }
    }
  })


  var matchInput = /^\[([^\]]+)\](.*)/;

  app.filter('shortname', function() {
    return function (input) {
      if(!input) return '';
      if(matchInput.test(input)) {
        return input.match(matchInput)[1];
      } else {
        return (input[0] || '').toUpperCase() + (input[1] || '').toLowerCase()
      }

    }
  })

  app.filter('name', function() {
    return function (input) {
      if(!input) return '';
      if(matchInput.test(input)) {
        return input.match(matchInput)[2];;
      } else {
        return input;
      }
    }
  })



})();


