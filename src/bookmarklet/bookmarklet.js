chrome.runtime.onMessage.addListener(
    function(tabs) {
        var bookmarklet = setupBookmarklet();
        bookmarklet.src = chrome.extension.getURL('src/bookmarklet/index.html?' + encodeURIComponent(tabs));
        document.body.appendChild(bookmarklet);
    }
);


var findImages = function() {
    var res = $(document.images).toArray();

    // Filter only the ones who are higher than 50 px
    res = res.filter(function(item) {
        return item.offsetHeight > 50;
    });

    // Sort the images
    return res.sort(function(a,b) {
        return a.offsetHeight < b.offsetHeight ? 1 : -1;
    });
}

var setupBookmarklet = function() {
    var iframe = document.createElement("iframe");
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

    window.addEventListener("message", function (message) {
        if (message.data === "collectably.bookmarklet.close") {
            document.body.removeChild(iframe);
        }
    });

    return iframe;
}



