var iframe = document.createElement("iframe");
iframe.src = chrome.extension.getURL('src/browser_action/bookmarklet.html');

iframe.style.position= "fixed";
iframe.style.top =  "50px";
iframe.style.marginLeft = "50%";
iframe.style.left = "-435px";
iframe.style.width = "870px";
iframe.style.backgroundColor = "#FFF";
iframe.style.height ="560px";
iframe.style.border = "0";
iframe.style.zindex = 2147483640;
iframe.id = "bookmarklet";

document.body.appendChild(iframe);