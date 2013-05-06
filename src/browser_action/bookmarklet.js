var iframe = document.createElement("iframe");
iframe.src = chrome.extension.getURL('src/browser_action/bookmarklet.html');

iframe.style.position= "fixed";
iframe.style.top =  "29px";
iframe.style.marginLeft = "50%";
iframe.style.left = "-436px";
iframe.style.width = "872px";
iframe.style.height ="580px";
iframe.style.border = "0";
iframe.style.zIndex = "9999999";
iframe.id = "bookmarklet";
iframe.name = "bookmarklet";
iframe.scrolling = "no";

document.body.appendChild(iframe);


window.addEventListener("message", function (message) {
    if (message.data === "collectably.bookmarklet.close") {
        document.body.removeChild(iframe);
    }
});


