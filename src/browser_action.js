chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: "src/bookmarklet/bookmarklet.js" });
    chrome.tabs.getSelected(null, function(tab) {

        chrome.tabs.query({}, function(tabs) {
            chrome.tabs.sendMessage(tab.id, JSON.stringify(tabs), null);
        });
    });
});

