(function (doc, win) {
    var width = 750;
    var height = 1500;
    var docEl = doc.documentElement;
    var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var reCalc = (function () {
        var reCalc = function () {
            var winWidth = docEl.clientWidth;
            var winHeight = docEl.clientHeight;
            if (!winWidth) return;
            var fontSize;
            if (winWidth < winHeight) {
                if ((winWidth / winHeight) > (height / width)) {
                    fontSize = (100 * (winHeight / height));
                } else {
                    fontSize = (100 * (winWidth / width));
                }
            } else {
                if ((winWidth / winHeight) > (height / width)) {
                    fontSize = (100 * (winWidth / height));
                } else {
                    fontSize = (100 * (winHeight / width));
                }
            }
            docEl.style.fontSize = (fontSize > 110 ? 110 : fontSize) + 'px';
            return reCalc;
        };
        return reCalc();
    })();
    if (!doc.addEventListener) return;
    win.addEventListener(rszEvt, reCalc);
})(document, window);

(function () {
    var getQuery = function (name) {
        var m = window.location.search.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
        return !m ? '' : decodeURIComponent(m[2]);
    };
    if (!getQuery('_wv')) {
        if (window.location.search) {
            window.location.href += '&_wv=1';
        } else {
            window.location.href += '?_wv=1';
        }
    }
}());
