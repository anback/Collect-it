// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
/*
var settings = new Store("settings", {
     "sample_setting": "This is how you use Store.js_bak to remember values"
 });
*/

chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.executeScript(null, {code : "console.log('testBrowerAction')"});
});



//example of using a message handler from the inject scripts
/*chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });
    */