;(function() {

var app = angular.module('service-storage',[]);


// Remove angular specifics
function cleanObject(obj) {
  return angular.fromJson( angular.toJson(obj) );
}

app.factory('homyStorage', ['$q', '$rootScope', function($q, $rootScope) {

  var DEFAULT = {
    _version: '1',
    _rev:  (new Date()).getTime(),
    _next: 1,
    background: 'rgb(51,62,76)',
    links: []
  };

  var service = {
    data: null

    ,load: function() {
      console.log('Load')
      var d = $q.defer();
      chrome.storage.local.get(function(value) {

        if(chrome.runtime.lastError) {
          return d.reject(chrome.runtime.lastError);
        }
        if(value._rev) {
          service.data = angular.extend({}, DEFAULT, value);
        } else {
          service.data = DEFAULT;
        }
        console.log('Resolve ...', service.data);
        d.resolve(service.data);

      });
      return d.promise;
    }

    ,save: function(data) {
      var d = $q.defer();

      if(data) {
        service.data = data;
      }

      service.data._rev = (new Date()).getTime();

      console.log('Save...', service.data);

      chrome.storage.local.set(cleanObject(service.data), function() {
        $rootScope.$apply(function() {
          if(chrome.runtime.lastError) {
            console.log('save error');
            d.reject(chrome.runtime.lastError);
          } else {
            console.log('save done');
            d.resolve(true);
            console.log('save done and resolved');
          }
        });
      });
      return d.promise;
    }

    ,import: function(jsonSource) {
      var data;
      try {
        data = angular.fromJson(jsonSource);
      } catch(e) {
        alert('Invalid file content: Is it a valid Homy file?');
        return;
      }
      console.log(data);
      switch(data._version) {
        case "1":
          // Normalize data using default values
          data = angular.extend({}, DEFAULT, data);
          service.data = data;
          return service.save();
        default:
          alert('Sorry, this file is from a earlier version of Homy, please update to the last version to import this file.');
      }

    }

    ,getLinkFor: function(url, title) {
      console.log('getLinkFor(%s,%s)', url, title)
      return service.load().then(function(data) {
        var link;
        data.links.some(function(b) {
          if(b.url === url) {
            link = b;
            return true;
          }
          return false;
        });
        if(link) {
          console.log('getLinkFor ... Ok, found', link);
          return link;
        }
        if(!link) {
          link = {
            id  : data._next++,
            url : url || '',
            name: title || ''
          }
          console.log('getLinkFor ... Not found, create and save', link);
          data.links.push(link);
          return service.save(data).then(function() {
            console.log('getLinkFor ... Saved, return link', link)
            return link
          }, function() {
            console.log('ERR')
          });
        }
      })
    }
    , createLink: function() {
      return service.getLinkFor('','');
    }

    ,saveLink: function(link) {
      return service.load().then(function(data) {
        if(!link.id) {
          // Add new link
          link.id = data._next++;
          data.links.push(link);
        } else {
          // Update current link
          data.links = data.links.map(function(current) {
            if(current.id !== link.id) return current;
            return link;
          })
        }
        return service.save(data).then(function() { return link });
      })
    }

    ,removeLink: function(link) {
      console.log('remove link ', link.id)
      return service.load().then(function(data) {
        data.links = data.links.filter(function(b) {
          return (b.id !== link.id);
        });
        return service.save(data);
      })
    }


    ,clear: function() {
      var d = $q.defer();
      chrome.storage.local.clear(function() {
        $rootScope.$apply(function() {
          if(chrome.runtime.lastError) {
            d.reject(chrome.runtime.lastError);
          } else {
            d.resolve(true);
          }
        });
      });
      return d.promise;
    }

    ,addChangeListener: function(cb) {
      chrome.storage.onChanged.addListener(function(changes, namespace) {
        if(namespace !== 'local') return;
        if(!changes._rev) return;
        if(service.data._rev === changes._rev.newValue) return;
        service.load().then(function(data) {
          cb(data);
        })
      });
    }
  };


  return service;
}]);



})();