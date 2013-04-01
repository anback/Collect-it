((function () {
    var a;
    a = function () {
        function b() {

            this.urlToBookmark = window.location.toString();
            this.bookmarkingContext = "BOOKMARKLET";
            if (typeof collectablyUrlToAdd != "undefined") {
                this.urlToBookmark = collectablyUrlToAdd;
                this.bookmarkingContext = "GLOBAL-ADD";
            }

            var BOOKMARKLET_HOST = "beta.collectably.com";
            if (typeof collectablyEnvironment != "undefined") {

                if (collectablyEnvironment == 'dev') {
                    BOOKMARKLET_HOST = "localhost:4000";
                } else if (collectablyEnvironment == 'staging') {
                    BOOKMARKLET_HOST = "secret-sierra-3406.herokuapp.com";
                } else if (collectablyEnvironment == 'collaborate') {
                    BOOKMARKLET_HOST = "afternoon-brook-2137.herokuapp.com";
                }
            }

            this.reScroll = {top: 0, left: 0};
            if (typeof collectablyReScroll != "undefined"){
                this.reScroll.left = collectablyReScroll.left;
                this.reScroll.top = collectablyReScroll.top;
            }


            this.iframe_id = "_mb_bookmarklet_iframe",
                this.iframe_name = "_mb_bookmarklet";
            if (document.getElementById("" + this.iframe_id))return;

            this.closer_id = "_mb_bookmarklet_closer",
            this.loader_id = "_collectably_bookmarklet_loader",
            this.scheme = "http",
            this.close_path = "https://d1698ooswzs1rf.cloudfront.net/assets/bookmarklet/close.png",
            /* removed the loading gif below by replacing it with a transparent gif - it appears in image picker */
            this.loading_path = "http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif",
            this.host = BOOKMARKLET_HOST,
            this.bookmarklet_path = "/api/bookmark",
            this.width = 910,
            this.height = 580,
            this.left = window.innerWidth / 2 - this.width / 2,
            this.closeLeft = this.left + this.width - 58,
            this.loadingLeft = this.closeLeft - 100,
            this.addIframe(),
            this.addCloser(),
            this.addLoader(),
            this.addIframeLoadEvent(),
            this.addCloseListener();

        }

        var a;
        return b.prototype.addIframe = function () {
            var a, b, c;
            a = {name:this.iframe_name, frameborder:0, height:this.height, src:"" + this.scheme + "://" + this.host + this.bookmarklet_path, style:"position: fixed; left: " + this.left + "px; top: 40px; z-index: 99999998; visibility: hidden; height: " + this.height + "px; width: " + this.width + "px;", width:this.width, scrolling:"no"}, b = document.createElement("iframe"), b.id = this.iframe_id;
            for (c in a)b.setAttribute(c, a[c]);
            return document.body.appendChild(b)
        }, b.prototype.getIframe = function () {
            return document.getElementById(this.iframe_id)
        }, b.prototype.addCloser = function () {
            var a, b, c, d;
            d = this.close_path, a = {onclick:'window.postMessage("collectably.bookmarklet.close", "*")', src:d, style:"display:block !important; cursor: pointer; position: fixed; left: " + this.closeLeft + "px; top: 78px; z-index: 99999999;"}, b = document.createElement("img"), b.id = this.closer_id;
            for (c in a)b.setAttribute(c, a[c]);
            return document.body.appendChild(b)
        }, b.prototype.addLoader = function () {
            var a, b, c, d;
            d = this.loading_path, a = {src:d, style:"display:block !important; cursor: pointer; position: fixed; left: " + this.loadingLeft + "px; top: 78px; z-index: 99999997;"}, b = document.createElement("img"), b.id = this.loader_id;
            for (c in a)b.setAttribute(c, a[c]);
            return document.body.appendChild(b)
        }, b.prototype.getCloser = function () {
            return document.getElementById(this.closer_id)
        }, b.prototype.getLoader = function () {
            return document.getElementById(this.loader_id)
        }, b.prototype.addIframeLoadEvent = function () {
            var a, url, that = this;
            /*
            console.log(this.reScroll);
            window.scrollTo(this.reScroll.left, this.reScroll.top);
            */
            return url = this.urlToBookmark, a = this.getIframe(), a.addEventListener("load", function (d) {
                return a.style.visibility = "visible",
                    a.contentWindow.postMessage(
                        {
                            url:url,
                            bookmarkingContext: that.bookmarkingContext,
                            title:(typeof document != "undefined" && document !== null ? document.title : void 0) || "",
                            images:that.findImages()}, "" + that.scheme + "://" + that.host),
                    window.postMessage("collectably.bookmarklet.loaded", "*")
            })
        }, b.prototype.addCloseListener = function () {
            var a = this;
            return window.addEventListener("message", function (b) {
                var c, d, e;
                if (b.data === "collectably.bookmarklet.close") {
                    d = a.getIframe(), d && document.body.removeChild(d), c = a.getCloser(), e = a.getLoader();
                    if (e)document.body.removeChild(e)
                    if (c)return document.body.removeChild(c)
                }
            })
        }, b.prototype.findImages = function () {
            var arr = [];
            // Find all the images
            for(var i = 0; i < document.images.length; i++) {
                if (a.width >= 80 && a.height >= 80)return c.push(a.src)
                arr.push(document.images[i]);
            }
            // Enrich with information
            var res = arr.map(function(item) {
                return {imgSrc : item.src, imgW : item.offsetWidth, imgH : item.offsetHeight, description: item.alt};
            });

            // Filter only the ones who are higher than 50 px
            res = res.filter(function(item) {
                return item.imgH > 50;
            });

            // Sort the images
            res = res.sort(function(a,b) {
                return a.imgH < b.imgH ? 1 : -1;
            });

            return res;

        }, a = function (a) {
            var b, c, d, e, f;
            c = {}, b = [], d = 0, f = a.length;
            while (d < f)e = a[d], c.hasOwnProperty(e) || (c[e] = !0, b.push(e)), ++d;
            return b
        }, b
    }(), new a
})).call(this)