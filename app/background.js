/* From http://davidwalsh.name/function-debounce */
function debounce (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this; var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function addUrl (tabId, changeInfo, tab) {
  if (/^(http:|https:)/.test(tab.url)) {
    chrome.action.enable(tabId);
  }
  chrome.storage.local.get(function (data) {
    if (!data.links) return;
    updateTabStar(tab, data.links);
  });
}

function updateTabStar (tab, links) {
  if (links.some(function (b) {
    if (!b) return false;
    return b.url === tab.url
  })) {
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        19: 'assets/images/homy_19_on.png',
        38: 'assets/images/homy_38_on.png'
      }
    });
  } else {
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        19: 'assets/images/homy_19_off.png',
        38: 'assets/images/homy_38_off.png'
      }
    });
  }
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(addUrl);

// Update icone status if required
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace !== 'local') return;
  if (!changes.links) return;
  chrome.tabs.query({ url: '<all_urls>' }, function (tabs) {
    tabs.forEach(function (tab) {
      if (!tab) return;
      updateTabStar(tab, changes.links.newValue)
    });
  });
});

// Synchronizer
var localToSyncDebounce = debounce(function (changes) {
  console.log('localToSyncDebounce', changes);
  chrome.storage.local.get(function (localData) {
    if (!localData._rev) return;
    chrome.storage.sync.get(function (syncData) {
      if (!syncData._rev || syncData._rev < localData._rev) {
        chrome.storage.sync.set(localData, function () { console.log('localToSyncDebounce: DONE') });
      } else {
        console.log('syncToLocalDebounce : sync is up to date sync:%s/local:%s', syncData._rev < localData._rev)
      }
    })
  });
}, 10000);

var syncToLocalDebounce = debounce(function (changes) {
  console.log('syncToLocalDebounce', changes);
  chrome.storage.sync.get(function (syncData) {
    if (!syncData._rev) return;
    chrome.storage.local.get(function (localData) {
      if (!localData._rev || localData._rev < syncData._rev) {
        chrome.storage.local.set(syncData, function () { console.log('syncToLocalDebounce: DONE') });
      } else {
        console.log('syncToLocalDebounce : local is up to date local:%s/sync:%s', localData._rev, syncData._rev)
      }
    })
  });
}, 1000);

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log('Changes on %s', namespace, changes)
  switch (namespace) {
    case 'local':
      localToSyncDebounce(changes);
      break;
    case 'sync':
      syncToLocalDebounce(changes);
      break;
  }
});
