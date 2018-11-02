chrome.devtools.panels.create("Spat_nav",
    "icon.png",
    "panel.html",
    function(panel) {
    }
);

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

